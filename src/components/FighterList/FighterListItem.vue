<template>
    <div class="fl-item"
         :class="(selected === parseInt(item.id))? 'selected' : ''"
         @click="select(parseInt(item.id))"
    >
        <ClubBannerSmall :item="item"></ClubBannerSmall>
        <DebugWrapper>
            <small>[{{ item.id }}]</small>
        </DebugWrapper>
        <NIcon :id="item.id"></NIcon>
        <TeamBannerWrapper :id="parseInt(item.id)"></TeamBannerWrapper>
        <span :data-id="item.id" style="margin-right: 5px">{{ name(item.name) }}</span>
        <FighterStatusList :item="item" :time="time"></FighterStatusList>
        <span class="eff">
            {{ item.effectiveness }}
            <span>
                <SkillTooltip :data="getEff()"></SkillTooltip>
            </span>
        </span>

        <!--
        <span class="skill-icons">
            <WeaponSetIcon :cat-key="getEff()[0]"></WeaponSetIcon>
            <span class="value">{{getEff()[1]}}</span>
            <template v-if="getEff()[2]">
                <WeaponSetIcon :cat-key="getEff()[2]"></WeaponSetIcon>
                <span class="value">{{getEff()[3]}}</span>
            </template>
            <WeaponSetIcon :cat-key="getEff()[4]"></WeaponSetIcon>
                <span class="value">{{getEff()[5]}}</span>
        </span>
        -->
        <template v-if="showSelector()">
            <div class="fight-selector"
                 @click.stop="markFighterForBattle" :class="{marked: marked}">
                {{marker()}}
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {traumaLeft} from "../../lib/traumaLeft";
    import {locale, localeKey} from "../../Locale";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import DebugWrapper from "../../DebugWrapper.vue";
    import NIcon from "./NIcon.vue";
    import WeaponSetIcon from "./WeaponSetIcon.vue";
    import {calcEff} from "./calcEff";
    import SkillTooltip from "./SkillTooltip.vue";
    import {parseIntE} from "../../lib/parseIntE";
    import ClubBannerSmall from "./ClubBannerSmall.vue";
    import FighterStatusList from "./FighterStatusList.vue";
    import {Prop} from "vue-property-decorator";
    import {selectFighter} from "../../lib/selectFighter";
    import TeamBannerWrapper from "../Teams/TeamBannerWrapper.vue";
    import {getWeaponCode} from "./getCategoryCode";
    import {getOwnedItems} from "./getOwnedItems";

    @Component({
        components: {
            TeamBannerWrapper,
            ClubBannerSmall, SkillTooltip, NIcon, DebugWrapper, WeaponSetIcon, FighterStatusList},
        props: {
            // selected: Number,
            // item: Object,
            // selectFighter: Function,
            // isEquipped: Object,
            showAddPanel: Boolean,
            // markFighterForBattle: Function,
            marked: Boolean,
            time: Number,
        },
        computed: {
            selected() { return this.$store.getters.SELECTED_FIGHTER; },
        }
    })
    export default class FighterListItem extends Vue {
        selected !: number;
        @Prop({ required: true }) readonly item!: IFighter;
        // @Prop() selectFighter!:(id: number) => void;

        optionsShortNames = true;

        name(fullName: string): string {
            if(!this.optionsShortNames) return fullName;

            const data = fullName.split(' ');
            return `${data[0].charAt(0)}. ${data[1]}`
        }

        select(id: number) {
            selectFighter(this, id);
        }
        // isEquipped!: IEquipState;
        // marked: boolean = false;
        showOldEff = false;
        showCombat(num: string) {
            this.$store.dispatch('SET_CID', parseIntE(num));
            EventBus.emit(Events.ShowCombatWindow);
        }
        marker() {
            return (this.$props.marked) ? '-' : '+';
        }
        showSelector() {
            const isBusy = this.$props.item.busy !== '0';
            const withTrauma = this.$props.item.trauma;
            return this.$props.showAddPanel && !isBusy && !withTrauma;
        }
        markFighterForBattle(e: Event) {
            // e.stopPropagation();

            const id = parseInt(this.$props.item.id);
            if(!this.$props.marked) {
                EventBus.emit(Events.MarkFighterForBattle, this.$props.item);
                // this.marked = !this.marked;
            } else {
                EventBus.emit(Events.UnmarkFighterForBattle, id);
            }
        }
        calcTooltip(e: Event) {
            // console.log('over', e.target);
        }
        tapEquipStatus() {
            // console.log('tapEquipStatus');
        }

        busyStatus(item: IFighter) {
            return localeKey('busyInCombat')(item.busy);
            // return this.l(`Is busy in combat ${item.busy}`);
        }
        traumaStatus(item: IFighter) {
            return item.trauma + '\n' + traumaLeft(item.traumaleft ?? '');
        }
        fatigue(item: IFighter) {
            return Math.max(parseIntE(item.fatigue) - this.$props.time, 0);
        }
        fatigueStatus() {
            return`
                <sub style="font-size: var(--f-size)">z</sub>
                z
                <sup style="font-size: var(--f-size)">z</sup>
            `;
        }
        getEff() {
            const fighter: IFighter = this.item;
            return calcEff(fighter);
        }
        l(textBit: string) {
            return locale(textBit)
        }
        mounted() {
            // this.marked = false;
            EventBus.on(Events.FriendlyCombatRequestFighterRemoved, (ids: number[]) => {
                // console.log('OnFriendlyCombatRequestFighterRemoved', id, parseInt(this.$props.item.id));
                // if(parseInt(this.$props.item.id) === id) {
                if(ids.includes(parseInt(this.$props.item.id))) {
                    // console.log('catch!');
                    // this.marked = false;
                }
            })
        }
    }
</script>

<style scoped>
    .eff {
        position: relative;
    }
    .eff > span {
        position: absolute;
        left: -200%;
        top: calc(100% + 5px);
        background-color: var(--main-bg-color);
        display: none;
        z-index: 667;
    }
    .eff:hover > span {
        /*background-color: #3f3090;*/
        display: initial;
    }
    .fl-item {
        direction:ltr;
        display: flex;
        flex-direction: row;

        margin: 4px;
        padding: 6px;
        cursor:pointer;
    }
    .fl-item:hover {
        background-color:var(--dim-color);
    }
    .fl-item span[data-id]{
        flex-grow: 1;
    }

    .fight-selector {
        background-color: lawngreen;
        width: min-content;
        color: black;
        font-family: monospace;
        user-select:none;
        padding: 0 5px;
        margin-left:5px;

        display: inline-flex;
        align-items:center;
    }
    .fight-selector.marked {
        background-color: darkgrey;
    }
    span {
        cursor: pointer;
    }
    .fl-item.selected {
        /* font-weight: bold; */
        background: brown;
        color: white;
    }
    .fl-item.selected:hover {
        background:#902121;
    }
</style>
