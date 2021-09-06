<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('friendlyFights')" :ctx="this"
                :options-button="true"
            ></AppScreenHeader>
            <AppScreenOptions ref="options"
                    :show-options="showOptions"
                    :ctx="screenName"
            ></AppScreenOptions>
            <div style="width: 400px; height: 1px; background-color: red" ></div>
            <!--
            <template v-if="showOptions">
                <div class="options-root">
                    <div class="options-content">
                        Options component
                        <hr>
                    </div>
                </div>
            </template>
            -->
            <DebugWrapper>
                <span>
                    <button @click="getList()">Get</button>
                    <button @click="mock()">Mock</button>
                    [{{selectedBattle}}]
                </span>
            </DebugWrapper>
            <FriendlyCombatRequest ref="fcr"
                :make-active="makeActive"
                :active="isActiveBattle('0')"
            ></FriendlyCombatRequest>
            <ListWrapper reset-scroll-dir>
                <template v-for="(item, i) in list">
                    <FriendlyItem
                        :key="i"
                        :item="item"
                        :getBannerSrc="getBannerSrc"
                        :getTeam="getTeam"
                        :serverTime="serverTime"
                        :make-active="makeActive"
                        :active="isActiveBattle(item.id)"
                    ></FriendlyItem>
                </template>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import FriendlyItem from "./Combat/FriendlyItem.vue";
    import {mock} from "./Combat/mockFights";
    import FriendlyCombatRequest from "./Combat/FriendlyCombatRequest.vue";
    import ListWrapper from "./ListWrapper.vue";
    import {Options} from "../Options";
    import {parseIntE} from "../lib/parseIntE";
    import IFriendlyCombatRequest from "./Combat/IFriendlyCombatRequest";
    import {showErrorInfoDialog} from "./DialogWrapper/showErrorDialog";
    import DebugWrapper from "../DebugWrapper.vue";
    import { GlobalTimers } from "../GlobalTimers";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {getFriendlyCombatList} from "../api/Combat/getFriendlyCombatList";
    import {addFighterToBattle} from "../api/Combat/addFighterToBattle";
    import {getServerTime} from "../api/getServerTime";

    import AppScreenOptions from "./AppScreenOptions/AppScreenOptions.vue";
    import {IAppScreenOptions} from "./AppScreenOptions/IAppScreenOptions";

    @Component({
        components: {AppScreenOptions, AppScreenHeader, DebugWrapper, FriendlyCombatRequest, FriendlyItem, ListWrapper},
        computed: {
            state() {
                return this.$store.getters.SCREENS
            }
        }
    })
    export default class CombatFriendlyScreen extends AppScreenX {
        // name: "CombatFriendlyScreen"
        showOptions = true;
        screenName = Screens.CombatFriendly;
        list: ICombatFriendly[] = [];
        serverTime: any = null;
        selectedBattle: string = '';
        $refs!: {
            fcr: FriendlyCombatRequest & IFriendlyCombatRequest,
            options: AppScreenOptions & IAppScreenOptions,
        };
        isActiveBattle(id: string) {
            return this.selectedBattle === id;
        }
        deactivateRequest() {
            this.selectedBattle = '';
            EventBus.emit(Events.AddFighterToTeamHide);
        }
        makeActive(id: string) {
            // console.log('parent make active', id, this.selectedBattle);
            if(this.selectedBattle === id) {
                this.deactivateRequest()
            } else {
                if(this.selectedBattle === '0') this.$refs.fcr.poked = false;

                this.selectedBattle = id;
                EventBus.emit(Events.AddFighterToTeamShow, parseInt(id));
            }
        }
        getTeam(item: ICombatFriendly, is: 0 | 1 = 0): any[] {
            let team: keyof ICombatFriendly = <keyof ICombatFriendly>`team${is}`;
            let t: string = <string>item[team];

            let names: keyof ICombatFriendly = <keyof ICombatFriendly>`teamnames${is}`;
            let n = <{[id: string]: string}>item[names];

            let clubInfo: keyof ICombatFriendly = <keyof ICombatFriendly>`teamclubs${is}`;
            let k = <{[key: string]: { id: string; img: string }}>item[clubInfo];
            // {"89":{"id":"18","img":"013.png"},"149":{"id":"18","img":"013.png"},"217":{"id":"18","img":"013.png"}}
            // console.log(JSON.stringify(k));
            // let clubId = k.id;

            return t
                .split(':')
                .map(e => ({
                    id:e, name: n[e], club: k[e] })
                );
        }
        getBannerSrc(img: string): URL {
            return new URL(`${Options.serverPath}img/clubbanners/small/` + img);
        }
        getList() {
            // this.mock();
            // return;
            getFriendlyCombatList()
                .then((result: ICombatFriendly[]) => {
                    // console.log('FC:', result);
                    this.list = result;
                    getServerTime()
                        .then(response => {
                            this.serverTime = response.time;
                        });
                })
        }
        toggleFold() {
            //deactivate battle when screen closes
            if(!this.folded) {
                this.deactivateRequest();
            }
            if(this.folded) {
                this.getList();
            }
            this.toggleFoldX(this);
        }
        mounted() {
            GlobalTimers.updaters.push({ctx: this, cb: ()=>{ this.getList() }});
            if(!this.folded) {
                this.getList();
            }
            EventBus.on(Events.CombatFriendlyScreenToggle, () => {
                this.toggleFold();
            });
            EventBus.on(Events.FriendlyCombatRequestAppCreated, () => this.getList());
            EventBus.on(Events.MarkFighterForBattle, (fighter: IFighter) => {
                // TODO: check for broken items here

                // console.log('CFS marked', fighter.id, 'for', this.selectedBattle);
                const id = parseIntE(this.selectedBattle);
                if (id < 1) {
                    return;
                }

                /*
                // checkfighter=650&combat=2497&act=add
                const msg: IMessage = {
                    [ServerActions.CheckFighter]: parseIntE(fighter.id),
                    combat: id,
                    act: 'add'
                };
                // apiMessage(msg).
                 */
                addFighterToBattle(parseIntE(fighter.id), id)
                    .then(res => {
                    // console.log('CF', res);
                    if(res === 1) {
                        EventBus.emit(Events.MarkFighterForBattleSuccess, fighter);
                        this.getList();
                    } else {
                        showErrorInfoDialog(res.result);
                    }
                })
            });
        }
        mock() {
            // console.log(mock);
            this.list = mock;
        }
    }
</script>

<style scoped>
    .screen-wrapper {
        background-color: var(--main-bg-color);
        display:flex;
        flex-direction:column;
        max-width: 45vw;
    }
</style>
