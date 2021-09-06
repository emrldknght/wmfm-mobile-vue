<template>
    <div class="screen-wrapper wrapper">
        <!-- <template v-if="!folded"> -->
        <!--
        <AppScreenHeader :header="l('shop')" :ctx="this"></AppScreenHeader>
        -->
        <template v-if="testEquip">
            <span style="position: absolute; right: 0">
                <button @click="toggleDummy()">
                    <small>Show dummy</small>
                </button>
            </span>
        </template>
        <span>
                <DebugWrapper>
                    <button @click="getShopItems()">⟲</button>
                </DebugWrapper>
                <label>{{l('forge')}}:
                    <select v-model="forgeryFilter">
                                <option value="-1">{{l('all')}}</option>
                                <template v-for="(item, key) in forges">
                                    <option :value="key">{{item}}</option>
                                </template>
                            </select>
                </label>
                <span style="display:flex; flex-direction:row">
                                <Filters ref="filters">
                                    <!--
                                    <template v-slot:armorSort>
                                        {{l('sortByDefence')}}:
                                        <SortSelect ref="sSortByDefence"></SortSelect>
                                        <select v-model="defenceSort">
                                            <template v-for="(item, key) in sortTypes">
                                                    <option :value="item">{{l(key)}}</option>
                                            </template>
                                        </select>
                                    </template>
                                    -->
                                </Filters>
                                <template v-if="isArmor()">
                                    {{l('sortByDefence')}}:
                                    <SortSelect ref="sSortByDefence" :on-change="changeSort" name="def"></SortSelect>
                                </template>
                            </span>
                <hr>
                <span>
                                <label>
                                    {{l('filterCanBuy')}}:
                                    <input type="checkbox" v-model="filterCanBuy">
                                </label>
                                <label>
                                    {{l('sortByPrice')}}:
                                    <SortSelect ref="sSortByPrice" :on-change="changeSort" name="pri"></SortSelect>
                                    <!--
                                    <select v-model="priceSort">
                                        <template v-for="(item, key) in sortTypes">
                                                <option :value="item">{{l(key)}}</option>
                                        </template>
                                    </select>
                                    -->
                                </label>

                            </span>
            </span>
        <template v-if="showDummy">
            <DebugDummy></DebugDummy>
        </template>
        <br>
        <template v-if="items.length !== 0">
            <ListWrapper reset-scroll-dir>
                <template v-for="(item, i) in filteredItems()">
                    <ShopItem :item="item" :key="i">
                        <template v-if="showDummy">
                            <button @click="addToTest(item)">Add to test</button>
                        </template>
                    </ShopItem>
                </template>
            </ListWrapper>
        </template>
        <template v-else>
                <span class="is-loading">
                    {{l('Loading')}}...
                </span>
        </template>
        <!-- </template> -->
    </div>
</template>

<script lang="ts">

    import Component from "vue-class-component";
    import {IShopItem} from "../interfaces/IShopItem";
    import ShopItem from "./Shop/ShopItem.vue";
    import ItemTypeFilterEl from "./Inventory/ItemTypeFilterEl.vue";
    import {ItemTypes} from "../interfaces/ItemTypes";
    import {IItem} from "../interfaces/IItem";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {parseIntE} from "../lib/parseIntE";
    import {Forge} from "./Shop/IForge";
    import ListWrapper from "./ListWrapper.vue";
    import DebugWrapper from "../DebugWrapper.vue";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {sortDown, sortUp} from "./Shop/sortItem";
    import DebugFighterItems from "./FighterInfo/DebugFighterItems.vue";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import DebugDummy from "./Shop/DebugDummy.vue";
    import {Options} from "../Options";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {getShopItems} from "../api/Shop/getShopItems";
    import Filters from "./Inventory/Filters.vue";
    import {IFilters} from "./Inventory/IFilters";
    // import {InterfaceState} from "../lib/InterfaceState";
    import {Sort} from "./Shop/Sort";
    import SortSelect from "./Shop/SortSelect.vue";
    import {ISortSelect} from "./Shop/ISortSelect";

    @Component({
        components: {
            SortSelect,
            Filters,
            DebugDummy,
            DebugFighterItems, AppScreenHeader, DebugWrapper, ShopItem, ItemTypeFilterEl, ListWrapper
        },
        computed: {
            money() {
                return this.$store.getters.MONEY
            },
        }
    })
    // export default class ShopScreen extends Vue{
    export default class ShopScreen extends AppScreenX {
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

        money!: number; // = 0;
        // folded: boolean = false;
        screenName = Screens.Shop;
        items: IShopItem[] = [];

        forges = Forge;
        forgeryFilter: string = "-1";

        $refs!: {
            filters: Filters & IFilters,
            sSortByPrice: SortSelect & ISortSelect,
            sSortByDefence: SortSelect & ISortSelect,
        };

        currentFilter() {
            return this.$refs.filters?.itemTypeFilter;
        }

        toggleFold() {
            // if(this.folded) {
            this.getShopItems();
            // }
            this.toggleFoldX(this);
            // this.folded = !this.folded;
            // InterfaceState.setState(this);
        }

        filterCanBuy: boolean = false;

        sortTypes = Sort;

        changeSort() {
            console.log('change', arguments[0]);
        }

        sortByPrice() {
            return (this.$refs.sSortByPrice) ? this.$refs.sSortByPrice.sortVal : Sort.None;
        }

        /*
        sortByPrice: Sort = Sort.None;
        get priceSort() {
            return this.sortByPrice
        }
        set priceSort(val) {
            this.sortByDefence = Sort.None;
            this.sortByPrice = val;
        }
        */

        sortByDefence() {
            return (this.$refs.sSortByDefence) ? this.$refs.sSortByDefence.sortVal : Sort.None;
        }

        /*
        sortByDefence: Sort = Sort.None;
        get defenceSort() {
            return this.sortByDefence;
        }
        set defenceSort(val) {
            // this.sortByPrice = Sort.None;
            this.sortByDefence = val;
        }
        */


        getSortedByPrice(items: IItem[]) {
            if (this.sortByPrice() === Sort.Down) {
                items.sort(sortDown.bind(null, 'cost'));
            }
            if (this.sortByPrice() === Sort.Up) {
                items.sort(sortUp.bind(null, 'cost'));
            }
        }

        getSortedByDefence(items: IItem[]) {
            if (this.sortByDefence() === Sort.Down) {
                items.sort(sortDown.bind(null, 'defence'));
            }
            if (this.sortByDefence() === Sort.Up) {
                items.sort(sortUp.bind(null, 'defence'));
            }
        }

        private getFiltered(items: IItem[]) {
            let equipped: IItem[] = [];
            items.forEach(item => {
                let matchFilter = (this.$refs.filters) ? this.$refs.filters.applyFilter(item) : true;

                if (this.forgeryFilter.toString() !== "-1") {
                    // filter = filter && (item.forgery === this.forgeryFilter);
                    matchFilter = matchFilter && (item.forgery === this.forgeryFilter);
                }

                // if (parseIntE(item.dressed) === 0 && filter) {
                if (parseIntE(item.dressed) === 0 && matchFilter) {
                    equipped.push(item);
                }
            });
            return equipped;
        }

        isArmor() {
            return this.currentFilter() === ItemTypes.Armor;
        }

        filteredItems() {
            console.log('shop: update list');
            if (this.items.length > 0) {
                let equipped: IItem[];
                equipped = this.getFiltered(this.items);

                if (this.isArmor()) this.getSortedByDefence(equipped);
                this.getSortedByPrice(equipped);

                if (this.filterCanBuy) {
                    equipped = equipped.filter((item: IItem) => parseIntE(item.cost) <= this.money);
                }

                return equipped;
            } else {
                return [];
            }

            // return this.list;
        }

        baseLoaded: boolean = false;

        goBase(items: IShopItem[]) {
            if (this.baseLoaded) return;
            let openRequest = indexedDB.open('shopBase', 1);
            openRequest.onerror = (err) => {
                console.error('Error', openRequest.error)
            };

            openRequest.onsuccess = () => {
                console.log('db op suc');
                if (this.baseLoaded) return;
                console.log('process base');

                let db = openRequest.result;
                db.onversionchange = function () {
                    db.close();
                    alert("База данных устарела, пожалуста, перезагрузите страницу.")
                };

                // db.createObjectStore('items', { keyPath: 'yid' })
                let transaction = db.transaction('items', 'readwrite');
                let itemsStore = transaction.objectStore('items');

                items.forEach(item => {
                    let request = itemsStore.put(item);
                    request.onsuccess = () => console.log('item added', request.result);
                    request.onerror = () => console.error(`!error: ${item.id}`, request.error);
                });

                this.baseLoaded = true;
                // InterfaceState.setStateKey(this, 'base-loaded', 'true');
                // InterfaceState.save();
            };
            openRequest.onupgradeneeded = (e) => {
                console.log('no idb - init');
                let db = openRequest.result;
                if (!db.objectStoreNames.contains('items')) {
                    console.log('creating storage for items');
                    db.createObjectStore('items', {keyPath: 'id'})
                }

                /*
                e.currentTarget.result.createObjectStore('myObjStore', {
                    keyPath: 'key'
                })
                 */
            };
            openRequest.onblocked = function () {
                // есть другое соединение к той же базе
                // и оно не было закрыто после срабатывания на нём db.onversionchange
            };

            // db.deleteObjectStore('books')
        }

        getBase() {

            let openRequest = indexedDB.open('shopBase', 1);
            openRequest.onerror = (err) => {
                console.error('Error', openRequest.error)
            };

            openRequest.onsuccess = () => {
                console.log('get db');

                let db = openRequest.result;
                let transaction = db.transaction('items', 'readonly');
                let itemsStore = transaction.objectStore('items');

                let allItems = itemsStore.getAll();

                allItems.onsuccess = () => {
                    console.log(allItems.result);
                    this.items = allItems.result;
                }


            };
            // db.deleteObjectStore('books')
        }

        getShopItems() {
            // $_REQUEST['GetMastersThings']page,$_REQUEST['Limit'],$_REQUEST['Type']
            /*
            const message: IMessage = {
                [ServerActions.ShopItems]: 1,
                Limit: 1000,
                Type: ShopItemTypes.All
            };
            apiMessage(message) */
            // if(!this.baseLoaded) {
            if (true) {
                getShopItems()
                    .then(res => {
                        // console.log('shop items:', res);
                        this.items = res;
                        // this.goBase(this.items);
                    })
            } else {
                // console.log('Get local shop');
                // this.getBase();
            }
        }

        mounted() {
            this.testEquip = Options.allowDummy();

            /*
            const base = InterfaceState.getStateKey(this,'base-loaded');
            console.log('base', base);
            this.baseLoaded = base as boolean;
             */

            // if(!this.folded) {
            this.getShopItems();
            // }
            EventBus.on(Events.ShopScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .is-loading {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .screen-wrapper {
        background-color: var(--main-bg-color);
        color: white;
    }

    div.wrapper {
        display: flex;
        flex-direction: column;
        /*max-width: 35vw;*/
        overflow: auto;
        position: relative;
    }

</style>
