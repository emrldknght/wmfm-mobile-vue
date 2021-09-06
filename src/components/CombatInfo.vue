<template>
    <div class="combat-info-wrapper" :class="{'show': !folded}">
        <div class="combat-info">
            <div style="grid-area: app-header">
                <AppScreenHeader header="Combat Info" :ctx="this"></AppScreenHeader>
            </div>
            <div class="combat-info-header">
                Combat ID {{id}}
                finished {{finished}}
            </div>
            <div class="combat-info-t t1">
                <span>Team 1</span>
                <span class="score">{{showScore(0)}}</span>
                <span class="team-list">
                    <template v-for="item in showTeam(0)">
                        <span>
                            <img :src="getBannerSrc(item.image)" alt="club-banner" width="11" height="11">
                            {{item.name}}
                        </span>
                    </template>
                </span>
                <!--
                <span>{{showTeam(0)}}</span>
                -->
            </div>
            <div class="combat-info-body">
                <template v-if="info">
                    <ListWrapper reset-scroll-dir ref="combatMessages">
                        <template v-for="(item, i) in info">
                            <template v-if="(i === info.length - 1) && finished">
                                <div :key="i" class="combat-info-event"
                                     v-html="formatEventLast(item.text)">
                                </div>
                            </template>
                            <template v-else>
                                <div :key="i" class="combat-info-event"
                                     v-html="formatEvent(item.text)">
                                </div>
                            </template>
                        </template>
                    </ListWrapper>
                </template>
            </div>
            <div class="combat-info-t t2">
                <span>Team 2</span>
                <span class="score">{{showScore(1)}}</span>
                <span class="team-list">
                    <template v-for="item in showTeam(1)">
                        <span>
                            <img :src="getBannerSrc(item.image)" alt="club-banner" width="11" height="11">
                            {{item.name}}
                        </span>
                    </template>
                </span>
                <!--
                <span>{{showTeam(1)}}</span>
                -->
            </div>


            <div class="combat-info-result" v-if="showResult()">
                <span style="grid-area: header">
                    Stats:
                </span>
                <span style="grid-area: l-col;">
                    L
                    <CombatResultTable :data="showResult().teams.h"></CombatResultTable>
                </span>
                <span style="grid-area: r-col;">
                    R
                    <CombatResultTable :data="showResult().teams.g"></CombatResultTable>
                </span>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import ListWrapper from "./ListWrapper.vue";
    import {ICombatEvent} from "./Combat/ICombatEvent";
    import {parseResults} from "./CombatList/parseResults";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import CombatResultTable from "./Combat/CombatResultTable.vue";
    import {GlobalTimers} from "../GlobalTimers";
    import IListWrapper from "../interfaces/IListWrapper";
    import {Watch} from "vue-property-decorator";
    import {formatEvent, formatTeam} from "./CombatList/format";
    import {Options} from "../Options";
    import TemplateScreen from "./TemplateScreen.vue";

    @Component({
        components: {
            TemplateScreen,
            CombatResultTable,
            AppScreenHeader,
            ListWrapper
        },
        computed: {
            id() { return this.$store.getters.COMBAT_ID; },
            info() { return this.$store.getters.COMBAT_INFO }
        }
    })
    export default class CombatInfo extends Vue {
        folded = true;
        id!: number;
        info!: ICombatEvent[];
        finished: boolean = false;

        getBannerSrc(file: string): URL {
            return new URL(`${Options.serverPath}/img/clubbanners/small/${file}`);
        }
        formatEvent(text: string) {
            return formatEvent(text);
        }
        formatEventLast(text: string) {
            text = formatEvent(text);

            // text = text.replace(/[|]/gm, '');
            let s = '(Лог';
            let i = text.indexOf(s);
            text = text.substring(0, i);

            return text;
        }

        @Watch('info')
        onUpdateInfo() {
            console.log('update combat info');
            this.$refs.combatMessages.scrollToBottom();
        }

        $refs!: {
            combatMessages: ListWrapper & IListWrapper
        };

        toggleFold() {
            this.folded = !this.folded;
            // this.toggleFoldX(this);

        }
        // combatId:number = -1;
        // combatInfo: ICombatEvent[] = [];
        showLastEvent(): ICombatEvent | null {
            return (this.info.length > 0) ? this.info[this.info.length - 1] : null;
        }
        showResult() {
            const result = this.showLastEvent();
            if(result) {
                let r = parseResults(result.text);
                if(r) this.finished = true;
                return r;
            } else {
                return '';
            }
        }
        showScore(num: number) {
            const t: keyof ICombatEvent = <keyof ICombatEvent>`score${num}`;
            const result = this.showLastEvent();
            return (result) ? result[t] : '';
        }
        showTeam(num: number) {
            // return num;
            const t: keyof ICombatEvent = <keyof ICombatEvent>`team${num}`;
            const result = this.showLastEvent();

            if(result) {
                let p: string = result[t];
                return formatTeam(p);
            }

            return [];
        }
        updateCombatData() {
            if(this.finished) return;
            // console.log('update combat data');
            this.$store.dispatch('UPDATE_COMBAT_DATA')
                .then(() => this.$refs.combatMessages.scrollToBottom());
            /*
            if(!this.folded) {
                if(this.id) {
                    this.$store.dispatch('UPDATE_COMBAT_DATA')
                        .then(() => this.$refs.combatMessages.scrollToBottom());

                }
            }
            */
        }
        mounted() {
            EventBus.on(Events.ShowCombatWindow, () => {
                this.folded = false
                // this.toggleFold();
            });
            GlobalTimers.add(this, () => { this.updateCombatData(); });

            // this.$store.dispatch('SET_CID', 6738);
            // EventBus.emit(Events.ShowCombatWindow);
        }
    }
</script>

<style scoped>
    .team-list {
        display: flex;
        flex-direction: column;
    }
    .score {
        display: flex;

        font-size: x-large;
        justify-content: center;
        padding: 3px 0;
        color: red;
    }


    .combat-info-wrapper {
        position: absolute;
        z-index: 666;
        display: grid;
        grid-template-columns: 1fr min-content 1fr;
        grid-template-rows: 1fr min-content 1fr;
        grid-template-areas:
            "a b c"
            "d ko f"
            "g g g"
    ;
        background-color: rgba(0, 0, 0, .8);
        width: 100%;
        height: 100%;
    }
    .combat-info-wrapper:not(.show) {
        display: none;

    }
    .combat-info {
        --w: 60vw;
        /*position: absolute;*/
        /*
        background-color: white;
        color: black;
        */
        width: var(--w);;
        left: 100%;
        display:grid;
        grid-template-columns: 4fr 12fr 4fr;
        grid-template-rows: min-content 1fr 12fr max-content;
        grid-template-areas:
                "app-header app-header app-header"
                "header header header"
                "t1 body t2"
                "result result result"
    ;
        max-height: 70vh;
        grid-area: ko;
        background-color: var(--main-bg-color);
        color: white;
    }
    .combat-info-header { grid-area:header; }
    .combat-info-body {
        grid-area:body;
        overflow-y:auto;
        display: flex;
    }
    .combat-info-event {
        border-bottom: 1px solid red;
    }
    .combat-info-t {
        display:flex;
        flex-direction:column;
    }
    .combat-info-t.t1 {
        grid-area: t1;
    }
    .combat-info-t.t2 {
        grid-area: t2;
    }
    .combat-info-result {
        /*background-color:lavender;*/
        grid-area: result;
        display:grid;
        /* flex-direction:column;*/
        grid-template-rows: max-content auto;
        grid-template-columns: auto auto;
        grid-template-areas: "header header" "l-col r-col";

    }
</style>
