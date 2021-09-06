import {Events} from "../../Events";
import {Events} from "../../Events";
import {Events} from "../../Events";
import {Events} from "../../Events";
<template>
    <div class="request-form">
        <div class="header">
            <button @click="crApp()">{{applicationButtonText()}}</button>
        </div>
        <template v-if="!folded">
            <button @click="clearTeam()">{{l('clearTeam')}}</button>
            <div class="col-left">
                <div id="appteam_0" class="team">
                    <template v-if="team.length === 0">
                        <div class="empty-team" @click="toggle()" :class="{'_active': poked}">
                            <template v-if="!poked">
                                {{l('tapToAddFighters')}}
                            </template>
                            <template v-else>
                                {{l('addFightersWithTheListOnTheLeft')}}
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <span @click="toggle()">
                        <FriendlyTeam
                                :data="team"
                                :remove="remove"
                                :active="active"
                                can-remove
                        ></FriendlyTeam>
                        </span>
                    </template>
                </div>
            </div>
            <div class="col-right">
                <span>
                    <label for="c-a-type">
                        {{l('combatType')}}:
                    </label>
                    <select v-model="type" id="c-a-type">
                        <template v-for="item in typeList">
                            <option :value="item">{{l(item)}}</option>
                        </template>
                    </select>
                </span>
                <!--
                <span>
                    <label for="c-a-nomination">{{l('nomination')}}:</label>
                    <select v-model="nomination" id="c-a-nomination">
                        <template v-for="item in nominationList">
                            <option :value="item">{{l(item)}}</option>
                        </template>
                    </select>
                </span>
                -->
                <span>
                    <label for="c-a-limit">{{l('numberOfFighters')}}:</label>
                        <select v-model="limit" id="c-a-limit">
                            <template v-for="item in limitList">
                                <option :value="item">{{item + ' x ' + item}}</option>
                            </template>
                        </select>
                        <span id="qappfighters_0">{{team.length}}</span>

                </span>
                <span>
                    <label for="c-a-time">{{l('timeToStart')}}:</label>
                        <select v-model="to_start" id="c-a-time">
                            <template v-for="item in to_startList">
                                <option :value="item">{{item + ' ' + l('minutes')}}</option>
                            </template>
                        </select>

                </span>
                <!--
                <span>
                    <label for="c-a-bet">{{l('bet')}}:</label>
                        <select v-model="bet" id="c-a-bet">
                            <template v-for="item in betList">
                                <option :value="item">{{item + ((item > 0)?'$': '')}}</option>
                            </template>
                        </select>

                </span>
                -->
                <span>
                    <label>{{l('comment')}}:
                        <input type="text" id="scomm" name="comment" v-model="comment">
                        <input type="hidden" name="sclass" id="sclass" :value="c_class">
                    </label>
                </span>
                <span style="display: flex; align-items: center">
                    <span class="team-limit" :class="{'wrong-size': !teamFull()}">
                        {{team.length}} / {{limit}}
                    </span>
                    <label>
                        <button
                                @click="sendApp()"
                        >
                            {{l('startCombat')}}
                        </button>
                    </label>
                </span>
            </div>
        </template>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import {IBattleType} from "../../interfaces/IBattleType";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import FriendlyTeam from "./FriendlyTeam.vue";
    import {findById} from "../../lib/findById";
    import {showSimpleInfoDialog} from "../DialogWrapper/showSimpleInfoDialog";
    import {showErrorInfoDialog} from "../DialogWrapper/showErrorDialog";
    import {parseIntE} from "../../lib/parseIntE";
    import {ICombatType} from "./ICombatType";
    import {Nomination} from "./INomination";
    import {ApplicationMessage} from "./IApplicationMessage";
    import {sendFriendlyApplication} from "../../api/Combat/sendFriendlyApplication";
    import {Watch} from "vue-property-decorator";
    import {IDialogMode} from "../DialogWrapper/IDialogMode";

    const Limits = [1, 3, 5, 10, 15, 21];
    const TimeToStart = [1, 5, 10, 15, 20, 30, 60];
    const Bets = [0, 10, 25, 50, 100];

    @Component({
        props: {
            makeActive: Function,
            active: Boolean
        },
        components: {FriendlyTeam}
    })
    export default class FriendlyCombatRequest extends Vue {
        folded: boolean = true;
        team: IFighter[] = [];

        poked: boolean = false;

        @Watch('team')
        onTeamChange() {
            const l = this.team.length;
            // console.log('Team changed', l);
            const newLimits = Limits.filter(e => e >= l);
            const nearest = newLimits[0];
            if(nearest) {
                this.limit = nearest;
            }
        }

        toggle() {
            this.$props.makeActive('0');
            this.poked = !this.poked;
        }
        remove(sid: string, e?: Event) {
            // if(e) e.stopPropagation();

            const id = parseInt(sid);
            // console.log('remove', id);

            const index = findById(this.team, id);
            // console.log('index', index);
            this.team.splice(index, 1);

            EventBus.emit(Events.FriendlyCombatRequestFighterRemoved, [id]);
        }

        crApp() {
            this.folded = !this.folded;
        }

        // name: "FriendlyCombatRequest"
        typeList = ICombatType;
        type: ICombatType = this.typeList.Buhurt;

        nominationList = Nomination;
        nomination: string = '';

        limitList = Limits;
        limit: number = this.limitList[0];

        to_startList = TimeToStart;
        to_start = this.to_startList[0];

        betList = Bets;
        bet = this.betList[0];

        comment: string = '';
        //? if usable
        c_class = IBattleType.Friendly;

        l(textBit: string) {
            return locale(textBit, true);
        }

        applicationButtonText(): string {
            return (this.folded)
                ? this.l('createApplication') as string
                : this.l('fold') as string;
        }

        clearTeam() {
            const teamIDs: number[] = this.team.map((e: IFighter) => parseIntE(e.id));
            EventBus.emit(Events.FriendlyCombatRequestFighterRemoved, teamIDs);
            this.team = [];
        }

        teamUnderLimit(): boolean {
            return this.team.length < this.limit;
        }
        teamOverLimit(): boolean {
            return this.team.length > this.limit;
        }
        teamFull(): boolean {
            return !(this.teamUnderLimit() || this.teamOverLimit());
        }

        sendApp() {
            if(this.team.length === 0) {
                showErrorInfoDialog(<string>this.l('ffRequestEmptyTeam'));
                return;
            }

            const getTeamString = (team: IFighter[]): string => {
                return team.reduce((acc, cv, ci, arr) => {
                    const rem = (ci < arr.length - 1) ? ':' : '';
                    return acc + cv.id + rem;
                }, '');
            };

            const createCombatRequest = () => {

                /*
                const teamString = this.team.reduce((acc, cv, ci, arr) => {
                    const rem = (ci < arr.length - 1) ? ':' : '';
                    return acc + cv.id + rem;
                }, '');
                 */

                const teamString = getTeamString(this.team);

                const msg: ApplicationMessage = {
                    team0: teamString,
                    type: this.type,
                    nomination: this.nomination,
                    teamlimit: this.limit,
                    comment: this.comment,
                    stime: this.to_start,
                    money: this.bet,
                    class: this.c_class
                };

                // console.log('will send', JSON.stringify(msg));

                // apiMessage(msg)
                sendFriendlyApplication(msg)
                    .then((res: any) => {
                        // console.log('application result', res);
                        if (res === 1) {
                            // application result 1
                            showSimpleInfoDialog(<string>this.l('combatRequestSend'));
                            this.toggle();
                            this.clearTeam();
                            EventBus.emit(Events.FriendlyCombatRequestAppCreated);
                        } else {
                            // Object { result: "Алло? Мы тут честно вонзаемся! Почему бойцов больше чем надо?" }
                            showErrorInfoDialog(res.result);
                        }
                    })

            };

            if(!this.teamFull()) {
                EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);

                const newText = (this.teamUnderLimit())
                    ? this.l('warnTeamUnderLimit')
                    : this.l('warnTeamOverLimit')
                ;

                EventBus.emit(Events.DialogSetText, newText);
                EventBus.emit(Events.DialogSetCallback, createCombatRequest);
                EventBus.emit(Events.DialogShow);
            } else {
                createCombatRequest();
            }
        }

        mounted() {
            // this.active = false;
            EventBus.on(Events.MarkFighterForBattle, (fighter: IFighter) => {
                // console.log('catch MarkFighterForBattle', fighter);
                if(this.$props.active) {
                    this.team.push(fighter);
                    EventBus.emit(Events.MarkFighterForBattleSuccess, fighter);
                }
            });
            EventBus.on(Events.UnmarkFighterForBattle, (id: string) => {
                // console.log('unmark', id);
                this.remove(id);
            })
        }
    }
</script>

<style scoped>
    .team-limit {
        margin-right: 5px;
        background-color: darkgreen;
        color: white;
    }
    .team-limit.wrong-size {
        background-color: yellow;
        color: black;
    }

    .header {
        grid-area: header;
    }

    .col-left {
        grid-area: left;
        padding: 2px;
    }
    .team {
        width: 100%;
        height: 100%;
        border: 1px solid black;
        box-sizing: border-box;
    }

    ._active {
        border: 3px double lime;
        box-sizing: border-box;
    }


    .empty-team {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    .col-right {
        grid-area: right;
        display: flex;
        flex-direction: column;
    }

    .col-right span {
        display: flex;
    }

    .col-right span label {
        width: 50%;
    }

    .request-form {
        display: grid;
        grid-template-columns: 3fr 2fr;
        grid-template-rows: 1fr auto;
        grid-template-areas: "header header" "left right";
        padding: 2px;
        background-color: rgba(255,255,255, .3);
        color:white;
    }
</style>
