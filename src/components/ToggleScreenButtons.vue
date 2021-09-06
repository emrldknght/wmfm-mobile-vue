<template>
    <div>
        <DebugWrapper></DebugWrapper>
        <div class="screens-buttons" @click="toggle">
        <ButtonGroup
            name="BGClub"
            data-group="club-info"
            :length="3"
            :active="active"
        >
            <Button :event="ev.ClubInfoScreenToggle" :screen="screens.ClubInfo">{{l('MyClub')}}</Button>
            <Button :event="ev.ClubListScreenToggle" :screen="screens.ClubList">{{l('AllClubs')}}</Button>
            <Button :event="ev.TrainingBaseScreenToggle" :screen="screens.TrainingBase">{{l('Base')}}</Button>
        </ButtonGroup>
        <ButtonGroup
            name="Fighters"
            data-group="fighters"
            :active="active"
            :length="5"
        >
            <Button :event="ev.FightersSummaryScreenToggle" :screen="screens.Summary">{{l('Summary')}}</Button>
            <Button :event="ev.FighterListToggle" :screen="screens.FighterList">{{l('FList')}}</Button>
            <template v-if="fi !== -1">
                <Button :event="ev.FighterInfoToggle" :screen="screens.FighterProfile">{{l('FView')}}</Button>
            </template>
            <Button :event="ev.TeamsScreenToggle" :screen="screens.Teams">{{l('Teams')}}</Button>
            <Button :event="ev.RecruitScreenToggle" :screen="screens.Recruit">{{l('Recruit')}}</Button>
            <Button :event="ev.TransferScreenToggle" :screen="screens.Transfer">{{l('Transfer')}}</Button>
        </ButtonGroup>
        <ButtonGroup
            name="BGInv"
            data-group="items"
            :length="4"
            :active="active"
        >
            <Button :event="ev.InventoryScreenToggle" :screen="screens.Inventory">{{l('Items')}}</Button>
            <Button :event="ev.MarketScreenToggle" :screen="screens.Market">{{l('Market')}}</Button>
            <Button :event="ev.ShopTabsScreenToggle" :screen="screens.ShopTabs">{{l('Shop')}}</Button>
            <Button :event="ev.RepairScreenToggle" :screen="screens.Repair">{{l('Repair')}}</Button>
        </ButtonGroup>
        <ButtonGroup
            name="BGCmb"
            data-group="combats"
            :length="4"
            :active="active"
            is-last
        >
            <Button :event="ev.CombatListScreenToggle" :screen="screens.CombatList">{{l('CList')}}</Button>
            <Button :event="ev.CombatFriendlyScreenToggle" :screen="screens.CombatFriendly">{{l('Friendly')}}</Button>
            <Button :event="ev.ChampionshipScreenToggle" :screen="screens.Championship">{{l('Champ')}}</Button>
            <Button :event="ev.EmptyScreenToggle">{{l('Festival')}}</Button>
        </ButtonGroup>
            <!--
        <ButtonGroup
            name="BGMsg"
            data-group="messages"
            :length="2"
            :active="active"
            is-last
        >
             <TButton :event="ev.MessagesScreenToggle" :screen="screens.Messages">{{l('Msg')}}</TButton>
             <TButton :event="ev.ChatScreenToggle" :screen="screens.Chat">{{l('Chat')}}</TButton>
        </ButtonGroup>
        -->
            <Button :event="ev.MessagesScreenToggle" :screen="screens.Messages">{{l('Msg')}}</Button>
            <Button :event="ev.ChatScreenToggle" :screen="screens.Chat">{{l('Chat')}}</Button>
            <!--
            <TButton :event="ev.PremiumShopScreenToggle" :screen="screens.PremiumShop">{{l('Donate')}}</TButton>
            -->
            <Button >
                <a :href="wikiLink" target="_blank">Wiki</a>
            </Button>
    </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Events} from "../Events";
    import Component from "vue-class-component";
    import ButtonGroup from "./ToggleScreenButtons/ButtonGroup.vue";
    import TButton from "./ToggleScreenButtons/TButton.vue";
    import {EventBus} from "../EventBus";
    import {showErrorInfoDialog} from "./DialogWrapper/showErrorDialog";
    import {Options} from "../Options";
    import {locale} from "../Locale";
    import DebugWrapper from "../DebugWrapper.vue";
    import {IScreen} from "../interfaces/IScreen";
    import {Screens} from "../interfaces/AppScreen/Screens";

    @Component({
        components: {DebugWrapper, Button: TButton, ButtonGroup},
        props: {
            // fi: Number
        },
        computed: {
            fi() {
                return this.$store.getters.SELECTED_FIGHTER;
            },
            state() { return this.$store.getters.SCREENS }
        }
    })
    export default class ToggleScreenButtons extends Vue{
        wikiLink = Options.serverPath + 'wiki';

        screens = Screens;
        state!: IScreen;

        active: string = '';

        l(textBit: string) {
            return locale(textBit, true);
        }


        toggleGroup(he: HTMLElement) {
            const data = he?.parentElement?.dataset.group;
            if (data) {
                this.active = (this.active === data)? '' : data;
            }
            // console.log(he, data);
        }
        ev = Events;
        toggle(e: Event) {
            const t = (<HTMLElement>e?.target);

            if(t) {
                const isG = t.classList.contains('sq');
                if(isG) {
                    // console.log('is sq');
                    this.toggleGroup(t);
                    return;
                }
            }

            // this.toggleScreen(t);
        }
        mounted() {
            // console.log('BB', this.state.getStateKey(this, 'active-group'));
            EventBus.on(Events.EmptyScreenToggle, () => showErrorInfoDialog('Screen not found!'));
        }
    }
</script>

<style scoped>
    .row {
        display:flex;
        flex-direction:row;
    }
    .screens-buttons {
        --f-dim-h: 4vw;
        --f-dim-w : 8vw;

        display:flex;
        flex-direction:row;
        justify-content: center;
        align-items:center;

        --margin-right: 1px;
    }
    @media screen and (orientation: portrait) {
        .screens-buttons {
            --f-dim-h: 9vh;
            --f-dim-w : 9vw;
        }
    }
    .screens-buttons span[data-screen] {
        overflow:visible;
        display: flex;
        align-items: center;
        justify-content: center;
        /*
        background-color: var(--main-bg-color);
        opacity: .9;
         */

        width: max-content;
        min-width:var(--f-dim-w);
        height: var(--f-dim-h);
        cursor:pointer;
        font-size: 14px;

        margin-right:var(--margin-right);
    }
    .screens-buttons span[data-screen]:hover {
        opacity: 1;
    }
</style>
