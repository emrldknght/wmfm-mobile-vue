<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('championship')" :ctx="this"></AppScreenHeader>
            <template v-if="options.id === 2">

                    <!--
                    <div class="champ-body">

                    <hr>
                    -->
                    <span class="nominations">
                        <template v-for="i in nom">
                            <span>
                                <span @click="getSchedule(i)">{{i.name}}</span>
                                <br>
                                    <span @click="getTable(i)">Таблица</span>
                                    /
                                    <span @click="getTeam(i)">Команда</span>
                            </span>
                        </template>
                    </span>
                    <!--
                    Ваши ближайшие бои:<br>
                    <ListWrapper>
                        <template v-for="(item, key) in timeToChamp">
                            <div style="border: 1px solid red">
                                [{{item.user0.id}}]
                                <template v-if="item.user0.fightername">
                                    {{item.user0.fightername}}
                                </template>
                                <template v-else>
                                    {{item.user0.club}}
                                </template>
                                VS
                                [{{item.user1.id}}]
                                <template v-if="item.user0.fightername">
                                    {{item.user1.fightername}}
                                </template>
                                <template v-else>
                                    {{item.user1.club}}
                                </template>
                                |
                                {{ findNameByCode(item.nomination) }}
                                |
                                {{ item.cmbtime }}
                            </div>
                        </template>
                    </ListWrapper>
                    -->

                    <hr>
                    <span v-html="data" id="raw-champ" @click="listenRaw($event)"></span>
                    <!--
                    </div>
                    -->


            </template>
        </template>
    </div>
</template>

<script lang="ts">

    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {apiMessageHtml} from "../lib/AjaxApi";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import DebugWrapper from "../DebugWrapper.vue";
    import {Options} from "../Options";
    import {getLeague, getTimeToChamp} from "../api/api";
    import {IChampMsg} from "./Championship/IChampMsg";
    import ListWrapper from "./ListWrapper.vue";

    type Nom = { name: string, code: string }
    const N: Nom[] = [
        { name: 'Щит-меч', code: 'shsw' },
        { name: 'Щит-дробящее', code: 'shmg' },
        { name: 'Бастард', code: 'bstrd' },
        { name: 'Древковое', code: 'plrm' },
        { name: '1х1', code: '1x1' },
        { name: '5х5', code: '5x5' },
        { name: '12х12', code: '12x12' },
        { name: '21х21', code: '21x21' },
        { name: 'Лига наци', code: 'ln' },
        { name: 'Кубок динамы', code: 'kd' },
    ];

    type NearestBattle = {
        id: string; // "id":"530";
        "user0": { "id": "12", "club": "Гондорцы из Гондураса", "img": "011.png", "fighterid": "292", "fightername": "Арсений Яшин" },
        "user1": { "id": "2", "club": "Угнетающие отморозки", "img": "002.png", "fighterid": "45", "fightername": "Филипп Ивашов" },
        nomination: Nom['code']; //"bstrd" //"nomination":"bstrd",
        league: string; //"0",
        team0: string; //"1",
        team1: string; //"1",
        cmbtime: string; //"1583577360",
        "result": "",
        "over": "0"
    };

    @Component({
        components: {ListWrapper, DebugWrapper, AppScreenHeader }
    })
    export default class ChampionshipScreen extends AppScreenX {
        options = Options;
        screenName = Screens.Championship;
        timeToChamp: NearestBattle[] = [];
        findNameByCode(code: string): string {
            let name = '';
            this.nom.forEach((e: Nom) => {
                if(e.code === code) name = e.name;
            });
            return name;
        }

        listenRaw(e: Event) {

            const tEl = (<HTMLElement>e.target)?.parentElement?.getAttribute('onclick') ?? ''; //?.onclick;

            const m = tEl.match(/^\S+[(']\S+[')]/gm);
            const m1 = (m) ? m[0] : '';
            const os = m1.indexOf('(');
            const cs = m1.indexOf(')');
            const params = m1.substring(os + 1, cs)
                .split(',')
                .map(s => s.replace(/`/gm, ''));

            const n = m1.substring(0, os);
            console.log('listenRaw', n, params);

            /*
            const msg = { getleague: params[0] , num: params[1] };
            apiMessage(<IMessage>msg)
            */
            getLeague(params[0], params[1])
                .then((result: any) => {
                    console.log(result);
                    this.data = result;
                })

        }



        getTimeToChamp() {
            /*
            const msg: IMessageChamp = { TimeToChamp: '', Amount: 100 };
            apiMessage(msg) */
            getTimeToChamp()
                .then((result: any) => {
                    this.timeToChamp = result;
                })
        }

        getSchedule(i: Nom) {
            // shedule
            console.log('shedule', i.name);
            this.getData(i.code, 'shedule');
        }
        getTable(i: Nom) {
            // table
            console.log('table', i.name);
            this.getData(i.code, 'table');
        }
        getTeam(i: Nom) {
            // team
            console.log('team', i.name);
            this.getData(i.code, 'team');
        }

        nom = N;
        data: string = "Champ data <hr> loading...";

        getData(nomination: string = '', category: string = '') {

            const msg: IChampMsg = { get: 'championship', nomination, category };

            apiMessageHtml(msg).then((res: string) => {
                // console.log('html', res);
                this.data = res;
            })
        }

        toggleFold() {
            this.toggleFoldX(this);
        }

        // championship
        mounted() {
            if(!this.folded) {
                this.getTimeToChamp();
                this.getData();
            }
            EventBus.on(Events.ChampionshipScreenToggle, () => this.toggleFold())
        }
    }
</script>

<style scoped>
    .screen-wrapper {
        max-width: 45vw;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    .nominations {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .nominations span {
        background-color: #9f9f9f;
        margin: 1px;
        flex-basis: fit-content;
        cursor: pointer;
    }
    .nominations span span:hover {
        background-color: #e6a900;
    }
    .champ-body {
        max-width: 45vw;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
</style>
