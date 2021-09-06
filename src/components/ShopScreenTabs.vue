<template>
    <div class="screen-wrapper wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('shop')" :ctx="this"></AppScreenHeader>
            <span class="shop-tabs" @click="selectTab($event)">
                <span :data-tab="tabs.Items" :class="isActiveTab(tabs.Items)">{{l('shopTabItems')}}</span>
                <span :data-tab="tabs.Sets" :class="isActiveTab(tabs.Sets)">{{l('shopTabSets')}}</span>
                <span :data-tab="tabs.Donate" :class="isActiveTab(tabs.Donate)">{{l('Donate')}}</span>
                <span>

                </span>
                <template v-if="testEquip">
                    <span style="position: absolute; right: 0">
                        <button @click="toggleDummy()">
                            <small>Show dummy</small>
                        </button>
                    </span>
                </template>
            </span>
            <template v-if="showDummy">
                <DebugDummy></DebugDummy>
            </template>
            <template v-if="activeShopTab === tabs.Items">
                <ShopScreen></ShopScreen>
            </template>
            <template v-if="activeShopTab === tabs.Donate">
                <PremiumShopScreen></PremiumShopScreen>
            </template>
            <template v-if="activeShopTab === tabs.Sets">
                <EquipSetsTab></EquipSetsTab>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
    import {IItem} from "../interfaces/IItem";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import Component from "vue-class-component";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import ShopScreen from "./ShopScreen.vue";
    import PremiumShopScreen from "./PremiumShopScreen.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import EquipSetsTab from "./Shop/EquipSetsTab.vue";
    import DebugDummy from "./Shop/DebugDummy.vue";

    enum ShopTabs {
        Items = 'items',
        Donate = 'donate',
        Sets = 'sets',
    }

    @Component({
        components: {
            EquipSetsTab,
            ShopScreen,
            PremiumShopScreen,
            AppScreenHeader,
            DebugDummy
        }
    })
    export default class ShopScreenTabs extends AppScreenX {
        // testEquip
        testEquip = false;
        // (Options.id === 1 || Options.id === 2 || Options.id === 3);
        toggleDummy() {
            this.showDummy = !this.showDummy;
        }

        showDummy = false;

        addToTest(item: IItem) {
            EventBus.emit(Events.AddItemDebug, item);
        }

        //\ testEquip

        // name: "ShopItemsTab"
        screenName = Screens.ShopTabs;
        isActiveTab(tab: ShopTabs) {
            return (tab === this.activeShopTab) ? 'active' : '';
        }

        tabs = ShopTabs;
        activeShopTab: ShopTabs = ShopTabs.Items;

        selectTab(e: Event) {
            const t = e.target as HTMLElement;
            const tab: ShopTabs = t.dataset.tab as ShopTabs;
            // console.log('select', tab);
            this.activeShopTab = tab;

        }

        toggleFold() {
            this.toggleFoldX(this);
        }
        mounted() {
            EventBus.on(Events.ShopTabsScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .shop-tabs{
        background-color:rgba(25, 25, 25, .8);
        display:flex;
        flex-direction:row;
    }
    .shop-tabs span{
        flex-grow:1;
        cursor:pointer;
        display:flex;
        justify-content:center;
        border-bottom:1px solid white;
        padding:10px 0;
        color:gray;
    }
    .shop-tabs span.active{
        background-color:var(--main-bg-color);
        color:white;
        border:1px solid white;
        border-bottom:0;
    }
    .shop-tabs span:last-child{
        flex-grow:2;
        cursor:default;
    }
    .shop-tabs span:not(:last-child):hover{
        background-color:var(--dim-color);
    }
    .shop-tabs span:not(:last-child){
        /* border-right: 1px solid white; */
    }
    div.wrapper {
        display:flex;
        flex-direction:column;
        max-width: 40vw;
        /*min-width: 34vw;*/
    }
</style>
