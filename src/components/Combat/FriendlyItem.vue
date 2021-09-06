<template>
    <div class="item">
        <div class="header">
            <div style="grid-area: banner">
                <img :src="getBannerSrc(item.img)" alt="banner">
            </div>
            <div style="grid-area: header-top">
                <DebugWrapper>[{{item.id}}]</DebugWrapper>
                {{item.clubname}}
                {{item.name}}
            </div>
            <div style="grid-area: header-bottom">
                <span class="combat-type" :class="item.type">{{l(item.type)}}</span>
                {{item.teamlimit}} vs {{item.teamlimit}}
                {{l('teamEff')}} {{item.team0eff}}
            </div>
            <div style="grid-area: time">
                {{remainingTime()}}
            </div>
        </div>
        <div class="comment">
            {{l('comment')}}: {{item.comment}}
        </div>
        <template v-if="showTeams || !(teamsFull())">
            <div class="column left" @click="makeActive(item.id)">
                <span>L:[{{teamFull(1)}}]</span>
                <FriendlyTeam
                        :data="getTeam(item, 1)"
                        :active="active"
                    >
                </FriendlyTeam>
            </div>
            <div class="column right">
                <span>R:[{{teamFull(0)}}]</span>
                <FriendlyTeam
                        :data="getTeam(item, 0)"
                >
                </FriendlyTeam>
            </div>
        </template>
        <template v-else>
            <span style="background-color: #3f3090; cursor: pointer;">
                Full
            </span>
            <span>
                <span @click="showFull()">[show teams]</span>
            </span>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import FriendlyTeam from "./FriendlyTeam.vue";
    import {parseTime} from "../../lib/parseTime";
    import {Prop, Watch} from "vue-property-decorator";
    import DebugWrapper from "../../DebugWrapper.vue";


    @Component({
        components: {DebugWrapper, FriendlyTeam},
        props: {
            // item: Object,
            // getBannerSrc: Function,
            // getTeam: Function,
            serverTime: Number,
            // makeActive: Function,
            active: Boolean
        }
    })
    export default class FriendlyItem extends Vue{
        @Prop() readonly item!: ICombatFriendly;
        @Prop() readonly getBannerSrc!: (path: string) => string;
        @Prop() readonly getTeam!: (combat: ICombatFriendly, teamNumber: number) => any[];
        @Prop() readonly makeActive!: (id: string) => void;
        // timerStarted: boolean = false;
        timer: number | null = null;
        interval: number | undefined = undefined;
        // item!: ICombatFriendly;

        showTeams: boolean = false;
        showFull() {
            this.showTeams = !this.showTeams;
        }
        teamFull(teamNumber: number) {
            return this.item.teamlimit == this.$props.getTeam(this.item, teamNumber).length;
        }
        teamsFull(): boolean {
            const t1Full = this.teamFull(1);
            const t0Full = this.teamFull(0);
            return t0Full && t1Full;
        }

        @Watch('serverTime')
        onServerTimeChanged() {
            // console.log('server time received');
            this.timer = parseInt(this.$props.item.time) - this.$props.serverTime;
            if(!this.interval) {
                this.interval = window.setInterval(() => {
                    if (this.timer) {
                        this.timer = this.timer - 1;
                        if (this.timer <= 0) clearInterval(this.interval);
                    }
                }, 1000)
            }
        }

        remainingTime() {
            // const sec: number = parseInt(this.$props.item.time) - this.$props.serverTime;
            return (this.timer) ? parseTime(this.timer) : '';
        }
        // name: "FriendlyItem"
        l(textBit: string) {
            return locale(textBit);
        }

    }
</script>

<style scoped>
    .combat-type.duel {
        color: #008800;
    }
    .combat-type.buhurt {
        color: #aa0000;
    }
    .header {
        grid-area: header;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
                "banner header-top time"
                "banner header-bottom time"
    ;
        justify-items: center;
        align-items: center;
    }
    .comment {
        grid-area: comment;
    }
    .teams {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        grid-template-areas: "left right";
    }
    .column {
        padding: 2px;
        display: flex;
        flex-direction: column;
    }
    .left {
        grid-area: left;
    }
    .right {
        grid-area: right;
    }

    .item {
        width: 99%;
        color:white;
        border-bottom: 1px solid white;
        display: grid;
        grid-template-rows: 1.5fr 0.5fr auto;
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
                "header header"
                "comment comment"
                "left right"
    ;
    }
</style>
