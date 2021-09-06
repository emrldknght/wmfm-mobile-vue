<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('repairScreen')" :ctx="this"></AppScreenHeader>
            <DebugWrapper>{{prices()}}</DebugWrapper>
            <button @click="repairAllItems()">{{l('repairAllFor')}} {{ repairAllPrice() }}</button>
            <Filters ref="filtersR">
                <OwnerFilter
                        ref="oFilter"
                        :owners="owners()"
                >
                </OwnerFilter>
                <label>{{l('sortByDamage')}}
                    <DebugWrapper>{{_sd()}}</DebugWrapper>
                    <SortSelect ref="sd"></SortSelect>
                    <!--
                    <select v-model="durSort">
                        <template v-for="(item, key) in sortTypes">
                            <option :value="item">{{l(key)}}</option>
                        </template>
                    </select>
                    -->
                </label>
                <label>
                    {{l('filterCriticalDamage')}}
                    <input type="checkbox" v-model="filterCriticalDamage">
                </label>
            </Filters>
            <ListWrapper class="repair-item-list">
                <template v-for="(item, i) in listSorted()">
                    <RepairListItem
                        :key="i"
                        :item="item"
                        :dressed-to="dressedTo"
                        :repair-item="repairItem"
                    ></RepairListItem>
                </template>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {IItem} from "../interfaces/IItem";
    import ListWrapper from "./ListWrapper.vue";
    import InventoryItem from "./Inventory/InventoryItem.vue";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import {parseIntE} from "../lib/parseIntE";
    import {findById} from "../lib/findById";
    import Filters from "./Inventory/Filters.vue";
    import {IFilters} from "./Inventory/IFilters";
    import OwnerFilter from "./Repair/OwnerFilter.vue";
    import {IOwnerFilter} from "./Repair/IOwnerFilter";
    import DebugWrapper from "../DebugWrapper.vue";
    import {RepairMode} from "../interfaces/RepairMode";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import {repairItem} from "../api/Repair/repairItem";
    import {repairAllItems} from "../api/Repair/repairAllItems";
    import RepairListItem from "./Repair/RepairListItem.vue";
    import {sortDown, sortUp} from "./Shop/sortItem";
    import {Sort} from "./Shop/Sort";
    import {brokePercent} from "./Repair/brokePercent";
    import SortSelect from "./Shop/SortSelect.vue";
    import {ISortSelect} from "./Shop/ISortSelect";

    interface IBrokenItem extends IItem {
        bp?: number
    }

    @Component({
        components: {
            SortSelect,
            RepairListItem,
            AppScreenHeader, DebugWrapper, OwnerFilter, ListWrapper, InventoryItem, Filters},
        computed: {
            list() { return this.$store.getters.BROKEN_ITEMS  }, //BROKEN_ITEMS
            fighters() { return this.$store.getters.FIGHTERS },
        }
    })
    export default class RepairScreen extends AppScreenX {
        screenName = Screens.Repair;
        list!: IItem[];
        fighters!: IFighter[];
        // folded = false;

        filterCriticalDamage: boolean = true;

        _sd() {
            return (this.$refs.sd)? this.$refs.sd.sortVal : '?';
        }

        owners() {
            let ownersMap = new Map<number, string>();
            this.list.forEach(item => ownersMap.set(parseIntE(item.dressed), this.dressedTo(item)));
            return ownersMap;
        }

        $refs!: {
            filtersR: Filters & IFilters,
            oFilter: OwnerFilter & IOwnerFilter;
            sd: SortSelect & ISortSelect
        };

        applyFilter(e: IItem): boolean {
            const oF = (this.$refs.oFilter) ? this.$refs.oFilter.getFilter(): -1;
            const ownerFilter = (oF !== -1) ? parseIntE(e.dressed) === oF : true;

            if (this.$refs.filtersR) {
                return this.$refs.filtersR.applyFilter(e) && ownerFilter;
            } else {
                return ownerFilter;
            }
        }

        listSorted(): IItem[] {
            let f = this.listFiltered().slice(0);
            f.forEach(e => e.bp = brokePercent(e));
            if(this.filterCriticalDamage) f = f.filter(e => (e.bp || 100) <= 40);

            if(this.$refs.sd) {
                if (this.$refs.sd.sortVal === Sort.Down) {
                    return f.sort(sortDown.bind(null, 'bp'));
                }
                if (this.$refs.sd.sortVal === Sort.Up) {
                    return f.sort(sortUp.bind(null, 'bp'));
                }
            }

            return f; //this.listFiltered();
        }

        listFiltered(): IItem[] {
            return this.list
                .filter(this.applyFilter);
        }

        dressedTo(item: IItem): string {
            const id: number = parseIntE(item.dressed);
            if (id > 0 && this.fighters.length > 0) {
                const index = findById(this.fighters, id);
                return this.fighters[index].name ?? 'no name';
            }
            return 'None';
        }
        getItems() {
            this.$store.dispatch('GET_BROKEN_ITEMS');
        }

        prices() {
            return this.list.map(item => item.repaircost);
        }

        repairItem(item: IItem) {
            const mode: RepairMode = RepairMode.Master;
            const id = parseIntE(item.id);

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);

            const index = findById(this.list, id);
            const itemName = this.list[index].name;
            const newText = `Вы уверены, что хотите починить предмет «${itemName}»?` +
                `\nЭто будет стоить $${item.repaircost}.`;

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
                    .then(() => {
                    this.getItems();
                    this.$store.dispatch('GET_STORAGE_ITEMS');
                    this.$store.dispatch('GET_MONEY');
                })
            });

            EventBus.emit(Events.DialogShow);
        }


        repairAllItems() {
            const mode: RepairMode = RepairMode.Master;

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            const newText = `Вы уверены, что хотите починить все предметы?` +
                `\nЭто будет стоить $${this.repairAllPrice()}.`;

            EventBus.emit(Events.DialogSetText, newText);
            EventBus.emit(Events.DialogSetCallback, () => {
                /*
                const msg: IMessage = {
                    [ServerActions.RepairItem]: 'all',
                    method: mode
                };
                apiMessage(msg)

                 */
                repairAllItems(mode)
                    .then(() => {
                    this.getItems();
                    this.$store.dispatch('GET_STORAGE_ITEMS');
                })
            });

            EventBus.emit(Events.DialogShow);
        }

        repairAllPrice(): number {
            return this.list.reduce((sum: number, item: IItem) => sum + (item.repaircost || 0 ) * 100, 0) / 100;
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
            EventBus.on(Events.RepairScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .repair-item-list {
        display: flex;
        flex-direction: column;
    }
    .screen-wrapper {
        max-width: 35vw;
        display: flex;
        flex-direction: column;
    }
</style>
