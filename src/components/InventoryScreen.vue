<template>
    <div class="screen-wrapper wrapper" @click="resetItem">
        <template v-if="!folded">
            <div class="inventory-screen">
                <AppScreenHeader :header="l('storage')" :ctx="this"></AppScreenHeader>
                <DebugWrapper>
                    <span>Inventory Screen [{{sid}}][{{index}}]</span>
                    <button @click="getItems()">⟲</button>
                    <div style="position:relative">
                    <span style="
                        display:flex; flex-direction:row; justify-content:right;
                        position:absolute;
                        right:0;
                        background-color:#7f3090;
                    ">
                        <button @click="toggleSets()" style="padding:0">
                            <img src="../img/hanger_22x22.png" width="22" height="22" alt="H"/>
                        </button>
                    </span>
                    </div>
                    <EquipSets v-show="showSets"></EquipSets>
                </DebugWrapper>

                <Storage
                    :items-data="items"
                    :items="items.length"
                    :not-equipped="getNotEquipped().length"
                ></Storage>
                <Filters ref="filters"></Filters>
                <template v-if="index !== -1">
                    <ItemInfo
                        :drop="dropItem"
                        :repair="repairItem"
                    >
                        <button @click="activateItem(selectedItemId)">
                            <template v-if="info().class === 'donate'">
                                {{l('use')}}
                            </template>
                            <template v-else>
                                {{l('equip')}}
                            </template>
                        </button>
                    </ItemInfo>
                </template>
                <template v-if="items">
                    <ListWrapper class="item-list">
                        <template v-for="(item, i) in getNotEquipped()">
                            <InventoryItem
                                :key="i"
                                :item="item"
                                :tap="tapItem"
                                :equip="activateItem"
                                :active="isActive(item.id)"
                            ></InventoryItem>
                        </template>
                    </ListWrapper>
                </template>
                <template v-else>
                    {{l('noItems')}}
                </template>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {findById} from "../lib/findById";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import InventoryItem from "./Inventory/InventoryItem.vue";
    import ItemInfo from "./Inventory/ItemInfo.vue";
    import {IItem} from "../interfaces/IItem";
    import {showSimpleInfoDialog} from "./DialogWrapper/showSimpleInfoDialog";
    import {parseIntE} from "../lib/parseIntE";
    import {showErrorInfoDialog} from "./DialogWrapper/showErrorDialog";
    import ListWrapper from "./ListWrapper.vue";
    import DebugWrapper from "../DebugWrapper.vue";
    import Filters from "./Inventory/Filters.vue";
    import {IFilters} from "./Inventory/IFilters";
    import Storage from "./Inventory/Storage.vue";
    import {RepairMode} from "../interfaces/RepairMode";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import {applyItem} from "../api/Inventory/applyItem";
    import {repairAllItems} from "../api/Repair/repairAllItems";
    import {repairItem} from "../api/Repair/repairItem";
    import {dropItem} from "../api/Inventory/dropItem";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import DebugDummy from "./Shop/DebugDummy.vue";
    import DebugFighterItems from "./FighterInfo/DebugFighterItems.vue";
    import EquipSets from "./Inventory/EquipSets.vue";

    @Component({
        components: {
            EquipSets,
            DebugFighterItems,
            DebugDummy,
            AppScreenHeader, Storage, Filters, DebugWrapper, ItemInfo, InventoryItem, ListWrapper},
        computed: {
            sid() { return this.$store.getters.SELECTED_FIGHTER; },

            items() { return this.$store.getters.STORAGE_ITEMS; },
            selectedItemId() { return this.$store.getters.SELECTED_ITEM; },
        }
    })
    export default class InventoryScreen extends AppScreenX {
        sid!: number;

        screenName = Screens.Inventory;
        items!: IItem[]; // = [];

        index: number = -1;
        selectedItemId!: number; // = -1;

        isActive(id: string) {
            return parseInt(id) === this.selectedItemId;
        }

        resetItem() {
            // console.log('reset item');
            // this.selectedItemId = -1;
            this.index = -1;

            this.$store.dispatch('SELECT_ITEM', -1);
        }

        tapItem(stringId: string) {
            const id = parseInt(stringId);
            // console.log('tap', id);
            // this.selectedItemId = id;
            this.index = findById(this.getNotEquipped(), id);

            this.$store.dispatch('SELECT_ITEM', id);
        }

        info(): IItem {
            if (this.index !== -1 && this.items.length > 0) {
                let i = findById(this.items, this.selectedItemId);
                return this.items[i];
            } else {
                return {}
            }
        }

        public getItems () {
            this.$store.dispatch('GET_STORAGE_ITEMS');
        }

        $refs!: {
            filters: Filters & IFilters
        };

        showSets: boolean = false;
        toggleSets() {
            this.showSets = !this.showSets;
        }

        getNotEquipped(): IItem[] {
            if (this.items.length === 0) return [];

            const equipped: IItem[] = [];
            this.items.forEach(item => {
                // filter
                const matchFilter = (this.$refs.filters) ? this.$refs.filters.applyFilter(item) : true;
                const isNotDressed = parseIntE(item.dressed) === 0;

                if (isNotDressed && matchFilter) {
                    equipped.push(item);
                }
            });
            return equipped;
        }
        toggleFold() {
            if(this.folded) {
                this.getItems();
            }
            this.toggleFoldX(this);
        }

        mounted() {
            if(!this.folded) {
                this.getItems();
            }
            EventBus.on(Events.InventoryScreenToggle, () => {
                this.toggleFold();
            });
            EventBus.on(Events.AddItem, (item: IItem) => {
                // ConsoleW.log('added item', item);
                this.getItems();
            });
            EventBus.on(Events.RemoveItem, (data: { fighter:number, id: number }) => {
                this.$store.dispatch('SET_ITEM_DRESS_STATUS_A', {id: data.id, status: 0});
                /*
                const index = findById(this.items, data.id);
                if (index !== -1) {
                    // this.items[index].dressed = (0).toString();
                }
                 */
            });
            EventBus.on(Events.TapEquippedItemOnFighterScreen, (id: number) => {
                this.index = findById(this.items, id);
                this.$store.dispatch('SELECT_ITEM', id);
            });
        }
        activateItem(data: string) {
            const fighter = this.sid; // parseInt(this.$props.selected);
            if(fighter === -1) return;

            const id = parseInt(data);
            const index = findById(this.items, id);
            const action = this.items[index].action;

            if(!action) {
                this.equipItem(fighter, id);
            } else {
                // console.log('use it');
                this.useItem(fighter, id, action);
            }
        }

        useItem(fighter:number, id: number, action: string) {
            // console.log(`use item ${id} to ${fighter}`);
            //const msg: IMessage = {"dress": id, "who": fighter};
            // apiMessage(msg)
            applyItem(id, fighter)
                .then((res: any) => {
                    // console.log('server answer', res);
                    if (res == 1) {
                        // this.$props.updateInventory();
                        this.index = -1;
                        // this.selectedItemId = -1;
                        this.$store.dispatch('SELECT_ITEM', -1);

                        this.getItems();

                        EventBus.emit(Events.UseItem, {fighter, action: action});
                    }
                });
        }
        equipItem(fighter:number, id: number) {


            //update local item data
            const index = findById(this.items, id);
            console.log('update local item data');
            this.items[index].dressed = fighter.toString();
            const item: IItem = this.items[index];

            // const msg: IMessage = {"dress": id, "who": fighter};
            // apiMessage(msg)
            applyItem(id, fighter)
                .then((res: any) => {
                    console.log('equip api m', res);
                    if (res === 1) {
                        console.log('equip success');
                        EventBus.emit(Events.EquipItem, { fighter, id, item });
                    } else {
                        console.warn('equip failed');
                        this.items[index].dressed = (0).toString();
                    }
                });
        }

        repairAllItems() {
            const mode: RepairMode = RepairMode.Master;
            const repairPrice = -1;

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            const newText = `Вы уверены, что хотите починить все предметы?` +
                `\nЭто будет стоить $${repairPrice}.`;

            EventBus.emit(Events.DialogSetText, newText);
            EventBus.emit(Events.DialogSetCallback, () => {
                /*
                const msg: IMessage = {
                    [ServerActions.RepairItem]: 'all',
                    method: mode
                };
                apiMessage(msg)
                 */
                repairAllItems(mode).then((res: any) => {
                    this.getItems();
                })
            });

            EventBus.emit(Events.DialogShow);
        }

        repairItem(id: number) {
            const mode: RepairMode = RepairMode.Self;
            const selfRepairPrice = 10;
            // console.log(`repair item ${id} : ${mode}`);

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);

            const index = findById(this.items, id);
            const itemName = this.items[index].name;
            const newText = `Вы уверены, что хотите попробовать сами починить предмет «${itemName}»?` +
                `\nВо первых, починить самому будет стоить $${selfRepairPrice} на запчасти.` +
                `\nВо вторых, это опасно и мы советуем обратиться к профессионалам!`;

            EventBus.emit(Events.DialogSetText, newText);
            EventBus.emit(Events.DialogSetCallback, () => {
                /*
                const msg: IMessage = {
                    [ServerActions.RepairItem]: id,
                    method: mode
                };
                apiMessage(msg)
                 */
                repairItem(id, mode)
                    .then((res: any) => {
                    this.getItems();
                })
            });

            EventBus.emit(Events.DialogShow);
        }

        dropItem(id: number) {

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);

            const index = findById(this.items, id);
            const itemName =  this.items[index].name;
            const newText = `Вы уверены что хотите выбросить предмет ${itemName}?`;

            EventBus.emit(Events.DialogSetText, newText);
            EventBus.emit(Events.DialogSetCallback, () => {
                /*
                const msg: IMessage = { [ServerActions.DropItem]: id };
                // console.log('will send', msg);
                apiMessage(msg)
                 */
                dropItem(id)
                    .then((res: any) => {
                    // console.log(res);
                    if(res == 1) {
                        showSimpleInfoDialog(<string>this.l('itemDropped'));
                        this.getItems();
                        // this.selectedItemId = -1;
                        this.$store.dispatch('SELECT_ITEM', -1);
                        this.index = -1;
                    } else {
                        showErrorInfoDialog(JSON.stringify(res));
                    }
                })
            });


            EventBus.emit(Events.DialogShow);
        }
    }
</script>

<style scoped>
    /* wrapper */
    .screen-wrapper {
        background-color: var(--main-bg-color);
        color: white;
    }
    /* \wrapper */
    .inventory-screen {
        /* background-color: indianred; */
        display: flex;
        flex-direction: column;

        --box-dim: 4vw;

        max-width: calc(5 * var(--box-dim))/*35vw*/;
    }
    /*
    .item-list {
        --bg-color: black;
    }
     */
    .item-list {
        max-height: 90%;
        display: flex;
        flex-flow: row wrap;
        flex-direction: row-reverse;
        max-width: 100%;
        padding: 1vw;
        flex-grow:1;
        align-content:start;
    }
</style>
