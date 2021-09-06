import {Events} from "./Events";
<template>
    <div id="root-me-here">
        <AppScreensState></AppScreensState>
        <VuexData></VuexData>
        <DialogWrapper></DialogWrapper>
        <CombatInfo></CombatInfo>
        <TopStripe :log-out="logOut"></TopStripe>
        <div class="main-screen">
            <DebugWrapper>
                <GameNews></GameNews>
            </DebugWrapper>
            <ClubInfoScreen></ClubInfoScreen>
            <ClubListScreen></ClubListScreen>
            <TrainingBaseScreen></TrainingBaseScreen>
            <FighterListScreen></FighterListScreen>
            <FighterSummary></FighterSummary>
            <template v-if="selectedFighter !== -1">
                <FighterInfoScreen></FighterInfoScreen>
            </template>
            <TeamsScreen></TeamsScreen>
            <InventoryScreen></InventoryScreen>
            <RecruitScreen></RecruitScreen>
            <TransferScreen></TransferScreen>
            <MarketScreen></MarketScreen>
            <ShopScreenTabs></ShopScreenTabs>
            <RepairScreen></RepairScreen>
            <CombatListScreen></CombatListScreen>
            <CombatFriendlyScreen></CombatFriendlyScreen>
            <ChampionshipScreen></ChampionshipScreen>
            <MessagesScreen></MessagesScreen>
            <ChatScreen></ChatScreen>
            <!-- <PremiumShopScreen></PremiumShopScreen> -->
        </div>
        <div class="footer">mobile</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import FighterInfoScreen from "./components/FighterInfoScreen.vue";
    import FighterListScreen from "./components/FighterListScreen.vue";
    import RecruitScreen from "./components/RecruitScreen.vue";
    import {Options} from "./Options";
    import InventoryScreen from "./components/InventoryScreen.vue";
    import {EventBus} from "./EventBus";
    import {Events} from "./Events";
    import CombatListScreen from "./components/CombatListScreen.vue";
    import MarketScreen from "./components/MarketScreen.vue";
    import {IItem} from "./interfaces/IItem";
    // import ShopScreen from "./components/ShopScreen.vue";
    import ShopScreenTabs from "./components/ShopScreenTabs.vue";
    import DialogWrapper from "./DialogWrapper.vue";
    import MessagesScreen from "./components/MessagesScreen.vue";
    import ChatScreen from "./components/ChatScreen.vue";
    import ToggleScreenButtons from "./components/ToggleScreenButtons.vue";
    import CombatFriendlyScreen from "./components/CombatFriendlyScreen.vue";
    import {parseIntE} from "./lib/parseIntE";
    import ClubListScreen from "./components/ClubListScreen.vue";
    import ClubInfoScreen from "./components/ClubInfoScreen.vue";
    import TrainingBaseScreen from "./components/TrainingBaseScreen.vue";
    // import TButton from "./components/ToggleScreenButtons/TButton.vue";
    import VuexData from "./VuexData.vue";
    import PlayerInfo from "./components/PlayerInfo.vue";
    import RepairScreen from "./components/RepairScreen.vue";
    import TransferScreen from "./components/TransferScreen.vue";
    import DebugWrapper from "./DebugWrapper.vue";
    import {GlobalTimers} from "./GlobalTimers";
    import TopStripe from "./TopStripe.vue";
    import CombatInfo from "./components/CombatInfo.vue";
    import AppScreensState from "./AppScreensState.vue";
    import ChampionshipScreen from "./components/ChampionshipScreen.vue";
    import GameNews from "./GameNews.vue";
    import PremiumShopScreen from "./components/PremiumShopScreen.vue";
    import FighterSummary from "./components/FighterSummary.vue";
    import {Prop} from "vue-property-decorator";
    import TeamsScreen from "./components/TeamsScreen.vue";
    import {selectFighter} from "./lib/selectFighter";
    import {setUserData} from "./api/setUserData";

    @Component({
        /*
        props: {
            logOut: Function
        },
         */
        components: {
            TeamsScreen,
            FighterSummary,
            PremiumShopScreen,
            GameNews,
            ChampionshipScreen,
            AppScreensState,
            CombatInfo,
            TopStripe,
            DebugWrapper,
            TransferScreen,
            RepairScreen,
            PlayerInfo,
            VuexData,
            TrainingBaseScreen,
            ClubInfoScreen,
            ClubListScreen,
            CombatFriendlyScreen,
            ChatScreen,
            MessagesScreen,
            DialogWrapper,
            ShopScreenTabs,
            MarketScreen,
            CombatListScreen,
            RecruitScreen,
            InventoryScreen,
            FighterInfoScreen,
            FighterListScreen,
            ToggleScreenButtons
        },
        computed: {
            list() { return this.$store.getters.FIGHTERS; },
            selectedFighter() { return this.$store.getters.SELECTED_FIGHTER; },
            // selectedFighterData() { return this.$store.getters.SELECTED_FIGHTER_DATA; },
            selectedFighterInventory() { return this.$store.getters.SELECTED_FIGHTER_INVENTORY; }
        }
    })
    export default class Main extends Vue {
        @Prop() logOut!:() => void;
        options = Options;

        list!: IFighter[];
        selectedFighter!: number; // = -1;
        // selectedFighterData!: IFighter;
        selectedFighterInventory!: IItem[]; // = [];

        preloadData() {
            // debugResetUserData();
            /* get Inventory onLoad */
            this.$store.dispatch('GET_STORAGE_ITEMS')
                .then(() => this.$store.dispatch('GET_FIGHTER_CATEGORIES'));
            this.$store.dispatch('GET_APP_OPTIONS').then(() => {
                // this.$store.dispatch('LOAD_TEAMS_LOCAL');
            });

        }
        mounted() {
            this.preloadData();
            GlobalTimers.start();
            EventBus.on(Events.UploadOptions,() => {
                const data = {
                    screenOptions: this.$store.getters.SCREEN_OPTIONS,
                    teams: this.$store.getters.FIGHTER_TEAMS
                    // etc
                };
                console.log('main - should save options', JSON.stringify(data));
                setUserData(data);
            });
            EventBus.on(Events.SelectNotOwnedFighter, (id: number) => {
                selectFighter(this, id);
            });
            EventBus.on(Events.SelectRecruit, (id: number) => {
                selectFighter(this, id);
            });

            EventBus.on(Events.EquipItem, (data: {fighter: number, id: number, item: IItem}) => {
                //check for existing item

                const slotsData = data.item.bodypart || '';
                const slots = slotsData.split(',');

                // console.log('check isEq', slots);

                const f = this.selectedFighterInventory.map(e => {
                    return { id: e.id, part: e.bodypart?.split(',') }
                });

                let id = -1;

                slots.forEach(s => {
                    f.forEach(i => {
                        if(!i.part?.indexOf(s)) {
                            id = parseIntE(i.id);
                        }
                    })
                });

                // console.log('check isEq id', id);
                if(id !== -1) {
                    EventBus.emit(Events.RemoveItem, {fighter: this.selectedFighter, id});
                }

                this.selectedFighterInventory.push(data.item);
            });
            EventBus.on(Events.RemoveItem, (data: {fighter: number, id: number}) => {

                const index = this.selectedFighterInventory.findIndex(el => parseIntE(el.id) === data.id);
                // console.log('Main: removed element index ' + index);

                if(index !== -1) {
                    this.selectedFighterInventory.splice(index, 1);
                } else {
                    // console.warn('Main: removed element not found');
                }
            })
        }

    }
</script>

<style>
    * {
        font-family: Tahoma, serif;
        font-size: small;
    }

    /* wrapper */
    .wrapper {
        display: flex;
        --flag-dim: 7vh;
    }
    /* \wrapper */

    #root-me-here {
        display: flex;
        flex-direction: column;
        height: 100vh;


        /*
        display: grid;
        grid-template-rows: 5.5fr auto 2fr;
        grid-template-columns: 1fr;
        grid-template-areas:
                "top-line"
                "bottom-line"
                "footer"
                */
    ;

    }
    @media screen and (orientation: portrait) {
        #root-me-here {
            /* grid-template-rows: 5vh auto; */
        }
    }

    .main-screen {
        grid-area: bottom-line;
        display: flex;
        flex-grow: 1;
        flex-direction: row;
        /*background-color: aqua;*/
        overflow-y: auto;

        background-color: var(--main-bg-color);
        background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23244f4f' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");

    }
    .footer {
        background-color: black;
        grid-area: footer;
        color: white
    }
</style>
