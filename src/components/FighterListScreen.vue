<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="header(list.length)" :ctx="this"></AppScreenHeader>
            <div class="controls">
                    <FighterCategoryFilter ref="catFilter"></FighterCategoryFilter>
                    <!-- {{getCategoryFilter()}} -->
                    <span style="flex-grow:1; text-align: right">
                        <DebugWrapper>{{header(list.length)}}</DebugWrapper>
                        {{l('sort')}}:
                    </span>
                <button @click="sortById">{{l('sortById')}}</button>
                <button @click="sortByEff">{{l('sortByEff')}}</button>
            </div>
            <!--
            {{cat}}
            -->
            <template v-if="list.length > 0">
                <ListWrapper>
                    <template v-for="(item, i) in list">
                        <!-- <span>[{{item.cat}}]</span> -->
                        <FighterListItem
                                :key="i"
                                :item="item"

                                :show-add-panel="showAddPanel"
                                :marked="isMarked(item.id)"
                                :time="serverTime"
                        ></FighterListItem>
                    </template>
                </ListWrapper>
                <DebugWrapper>
                    <template v-if="selectedIndex() !== -1">
                        <details>
                            <summary>data</summary>
                            {{ list[selectedIndex()] }}
                        </details>
                    </template>
                </DebugWrapper>
            </template>

            <div class="-fighter-list">
			<DebugWrapper>
                <span>
                    {{l('fighterList')}}[{{list.length}}/30]
                    [ sel: {{ selected }}][ i:{{selectedIndex() }} ]
                    <button @click="getFighterList">⟲</button>
                    <button @click="updateFighterTraumaStatus(selected)" title="update trauma status">+</button>
                    <br>
                    {{marked}}
                    <button @click="dropSelection">&larr;</button>
                </span>
            </DebugWrapper>

            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {Events} from "../Events";
    import {EventBus} from "../EventBus";
    import {findById} from "../lib/findById";
    import FighterListItem from "./FighterList/FighterListItem.vue";
    import {parseIntE} from "../lib/parseIntE";
    import ListWrapper from "./ListWrapper.vue";
    import DebugWrapper from "../DebugWrapper.vue";
    import {compareById} from "../lib/compareById";
    import {compareByEff} from "../lib/compareByEff";
    import {showErrorInfoDialog} from "./DialogWrapper/showErrorDialog";
    import {GlobalTimers} from "../GlobalTimers";
    import {localeKey} from "../Locale";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {getFighterData} from "../api/Fighter/getFighterData";
    import {getServerTime} from "../api/getServerTime";
    import FighterCategoryFilter from "./FighterList/FighterCategoryFilter.vue";
    import {IFighterCategoryFilter} from "./FighterList/IFighterCategoryFilter";
    import {CatFilter} from "./FighterList/CatFilter";

    interface IUseItemMessage {
        fighter: number;
        action: string;
    }

    interface IFighterWCat extends IFighter {
        cat?: string
    }

    @Component({
        components: {AppScreenHeader, DebugWrapper, FighterListItem, ListWrapper, FighterCategoryFilter},
        computed: {
            _list() { return this.$store.getters.FIGHTERS; },
            selected() { return this.$store.getters.SELECTED_FIGHTER; },
            // selectedData() { return this.$store.getters.SELECTED_FIGHTER_DATA; },
            cat() { return this.$store.getters.FIGHTER_CATEGORIES }
        }
    })
    export default class FighterListScreen extends AppScreenX {
        header(n: number) {
            return localeKey('fighterListHeader')(n);
        }

        _list!: IFighter[];
        selected!: number;
        cat!: { [id: string]: string };

        $refs!: {
            catFilter: FighterCategoryFilter & IFighterCategoryFilter;
        };
        getCategoryFilter(): CatFilter | null {
            return (this.$refs.catFilter) ? this.$refs.catFilter.value : null;
        }

        get list() {
            if(this.getCategoryFilter() && this.getCategoryFilter() !== 'all') {
                // console.log('filter', this.getCategoryFilter());
                let l = this._list.slice(0) as IFighterWCat[];
                l.forEach((item: IFighterWCat) => item.cat = this.cat[item.id || -1]);
                l = l.filter((item: IFighterWCat) => item.cat === this.getCategoryFilter());
                return (!this.sort) ? l : l.sort(this.sort);
            }

            return (!this.sort) ? this._list : this._list.slice(0).sort(this.sort);
        }

        selectedIndex() { return findById(this.list, this.selected); }

        sort: any | null = null ;
        sortById() { this.sort = compareById; }
        sortByEff() { this.sort = compareByEff; }

        screenName = Screens.FighterList;
        // folded: boolean = false;
        showAddPanel: boolean = false;

        marked: number[] = [];

        dropSelection() {
            this.$store.dispatch('SELECT_FIGHTER', -1);
        }

        serverTime: number | undefined = undefined;

        getFighterList() {
            getServerTime()
                .then(response => {
                    this.serverTime = response.time;
                });
            // console.log('get fighters');
            this.$store.dispatch('GET_FIGHTER_LIST')
                .then(() => EventBus.emit(Events.FighterListLoaded))
                .catch((e: Error) => showErrorInfoDialog(e.message));
        }

        checkAllEquipment() {
            this.$store.dispatch('GET_EQUIP_STATE_ALL');
        }

        checkEquipment(id: number) {
            this.$store.dispatch('GET_EQUIP_STATE', id);
        }

        toggleFold() {
            // this.folded = !this.folded;
            if(this.folded) {
                this.checkAllEquipment();
            }
            this.toggleFoldX(this);
        }

        getFighterData(id: number): IFighter {
            // apiRequest(ServerActions.Fighter, id)
            getFighterData(id)
                .then((res: IFighter) =>{
                    // console.log('get fighter data r->', res);
                    return res;
                });
            return { id: '-1', effectiveness: '-1' };
        }

        updateFighterTraumaStatus(fighter: number) {
            if(fighter === -1) return;
            const { trauma, traumaleft } = this.getFighterData(fighter);
            const index = findById(this.list, fighter);
            // this.data[index].trauma = trauma;
            // this.data[index].traumaleft = traumaleft;
        }
        updateFighterBusyStatus() {

        }
        isMarked(sid: string) {
            return this.marked.indexOf(parseInt(sid)) !== -1;
        }
        clearMark(id: number) {
            const index = this.marked.findIndex(e => e === id);
            // console.log('unmark', id, index);
            if(index >= 0) {
                this.marked.splice(index, 1);
            }
        }
        fixMinusTrauma() {
            //TODO: replace with Server.CheckTrauma
            let fwt = this._list
                .filter(e => e.trauma !== '' && parseIntE(e.traumaleft) < 0)
                .map(e => parseIntE(e.id))
                // .map(id => apiRequest(ServerActions.Fighter, id));
                .map(id => getFighterData(id));

            if(fwt.length > 0) Promise.all(fwt);
        }
        mounted() {
            GlobalTimers.updaters.push({ ctx: this, cb: () => {
                this.getFighterList();
                this.$store.dispatch('GET_FIGHTER_CATEGORIES');
            } });
            this.getFighterList();
            this.fixMinusTrauma();

            if(!this.folded) {
                this.checkAllEquipment();
            }
            EventBus.on(Events.FriendlyCombatRequestAppCreated, () => this.getFighterList());
            EventBus.on(Events.InviteFighter, () => { this.getFighterList(); });
            EventBus.on(Events.HireFighter, () => {
                this.$store.dispatch('SELECT_FIGHTER', -1);
                this.$store.dispatch('GET_SELECTED_FIGHTER_INVENTORY', -1);
                this.getFighterList();
            });

            EventBus.on(Events.AddFighterToTeamHide, () => this.showAddPanel = false);
            EventBus.on(Events.AddFighterToTeamShow, () => this.showAddPanel = true);
            EventBus.on(Events.MarkFighterForBattleSuccess, (fighter: IFighter) => {
                this.marked.push(parseIntE(fighter.id));
            });
            EventBus.on(Events.UnmarkFighterForBattle, (id: number) => {
                this.clearMark(id);
            });
            EventBus.on(Events.FriendlyCombatRequestFighterRemoved, (ids: number[]) => {
                ids.forEach(e => this.clearMark(e));
            });

            EventBus.on(Events.FighterListToggle, () => {
                this.toggleFold();
            });

            EventBus.on(Events.FighterListLoaded, () => {
                // console.log('caught in fighter-list');
                this.checkAllEquipment();
            });
            EventBus.on(Events.EquipItem, (data: {fighter: number}) => {
                const id = data.fighter;
                // console.log('equip - caught in fighter-list', id);
                this.checkEquipment(id);
            });
            EventBus.on(Events.RemoveItem, (data: {fighter: number, id: number}) => {
                const id = data.fighter;
                // console.log('remove - caught in fighter-list', id);
                this.checkEquipment(id);
            });
            EventBus.on(Events.UseItem, (data: IUseItemMessage) => {
                const action = data.action;
                if(action === 'heal') {
                    // update fighter trauma data
                    // TODO - change to single action
                    // this.$props.getFighterList();
                    this.updateFighterTraumaStatus(data.fighter);
                }
            })
        }
    }
</script>

<style scoped>
    .screen-wrapper {
        display: flex;
        flex-direction: column;
    }
    .controls {
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 2px;
        margin-top: 4px;
        align-items:center;
    }
    .fighter-list {
        color: white;

        max-height: 94%;
        display: flex;
        flex-direction: column;
        /*
        width:max-content;
        max-width: 30%;
        float: left;
        clear: none; */
		min-width: 20vw;
        max-width: 32vw;
    }

    .fighter-list span {
        cursor: pointer;
    }

    .fighter-list span:hover {
        /*
        font-weight: bold;
        */
    }
    .fighter-list span:hover span {
        display: block;
    }
</style>
