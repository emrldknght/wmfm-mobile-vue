<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('recruits')" :ctx="this"></AppScreenHeader>
            <DebugWrapper>
				<span>
					Recruit fighters<button @click="getFreeFighters()">⟲</button>
					<label>
						<input type="checkbox" v-model="topStats">
						No weak
					</label>
				</span>
            </DebugWrapper>
            <template v-if="remainingLockTime">
				<span style="color:yellow; display: flex; align-items: center; justify-content: center">
					{{l('recLocked')}} {{showRemainingLockTime()}}.
				</span>
            </template>
            <template v-if="list.length > 0">
                <div class="pages" v-show="pages > 0">
                    <template v-for="i in pages">
                        <span :class="{'current': i === page }" @click="getPage(i)">[{{i}}]</span>
                    </template>
                </div>
                <!--
                <div class="header-row fixed">
                    <template v-for="(cell, i) in tH">
                        <RecruitScreenTh
                                :key="i"
                                :text="l(cell[0])"
                                :sort-type="cell[1]"
                                :class-name="cell[2]"

                                :sort="sort"
                                :set-sort="setSort"
                                :sort-direction="showSortDirection"

                                :short="cell[3] || false"
                        ></RecruitScreenTh>
                    </template>
                    <div class="item-act">
                        <button style="opacity: 0">{{l('Invite')}}</button>
                    </div>
                </div>
                -->
                <RecruitScreenHeaderRow
                    :sort="sort"
                    :set-sort="setSort"
                    :show-sort-direction="showSortDirection"
                >
                </RecruitScreenHeaderRow>

                <ListWrapper class="list" reset-scroll-dir>
                    <template v-for="fighter in sorted()">
                        <RecruitScreenRow
                                :key="fighter.id"
                                :fighter="fighter"
                                :select="selectRecruit"
                                :invite="invite"
                        >
                        </RecruitScreenRow>
                    </template>
                </ListWrapper>
            </template>
            <template v-else>
                <div style=" width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
                    {{l('Loading')}}...
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component';
    import {locale} from "../Locale";
    import {SortDirection, SortFunction, SortType} from "../lib/Recruit";
    import RecruitScreenTh from "./Recruit/RecruitScreenTh.vue";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import RecruitScreenParameter from "./Recruit/RecruitScreenParameter.vue";
    import {showErrorInfoDialog} from "./DialogWrapper/showErrorDialog";
    import {showSimpleInfoDialog} from "./DialogWrapper/showSimpleInfoDialog";
    import {findById} from "../lib/findById";
    import RecruitScreenRow from "./Recruit/RecruitScreenRow.vue";
    import ListWrapper from "./ListWrapper.vue";
    import DebugWrapper from "../DebugWrapper.vue";
    import {parseTime} from "../lib/parseTime";
    import {Watch} from "vue-property-decorator";
    import {parseIntE} from "../lib/parseIntE";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Options} from "../Options";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {getRecruitLockTime} from "../api/Fighter/getRecruitLockTime";
    import {getServerTime} from "../api/getServerTime";
    import {recruitFighter} from "../api/Fighter/recruitFighter";
    import { getFreeFighters } from '../api/Fighter/getFreeFighters';
    import RecruitScreenHeaderRow from "./Recruit/RecruitScreenHeaderRow.vue";

    const TH = [
        ['Fighter', SortType.Name, 'item-n'],
        ['Height', SortType.Height, 'item-h'],
        ['Weight', SortType.Weight, 'item-w'],
        ['Age', SortType.Age, 'item-a'],
        ['Str', SortType.Str, 'item-s', true],
        ['Dex', SortType.Dex, 'item-d', true],
        ['Sta', SortType.Sta, 'item-st', true],
        ['Eff', SortType.Eff, 'item-ef', true],
    ];

    @Component({
        components: {
            RecruitScreenHeaderRow,
            AppScreenHeader,
            DebugWrapper, RecruitScreenRow, RecruitScreenParameter, RecruitScreenTh, ListWrapper}
    })
    export default class RecruitScreen extends AppScreenX {
        screenName = Screens.Recruit;
        list: IFighter[] = [];
        sort: SortType = SortType.Default;
        sortDirection = SortDirection.Down;
        topStats: boolean = false;

        page: number = 1;
        pages: number = 0;

        remainingLockTime: number | null = null;
        interval: number | undefined = undefined;
        @Watch('remainingLockTime')
        onRemainingLockTimeChanged() {
            // console.log('server time received');
            if(!this.interval) {
                this.interval = window.setInterval(() => {
                    if (this.remainingLockTime) {
                        this.remainingLockTime = this.remainingLockTime - 1;
                        if (this.remainingLockTime <= 0) clearInterval(this.interval);
                    }
                }, 1000)
            }
        }

        showRemainingLockTime() {
            return parseTime(this.remainingLockTime || 0);
        }

        SortType = SortType;

        tH = TH;

        getRecruitLockTime() {
            // const msg: IMessage = { [ServerActions.RecruitLockTime]: 0 };
            // const lt = apiMessage(msg);
            // const st = apiRequest(ServerActions.GetServerTime);

            const lt = getRecruitLockTime();
            const st = getServerTime();

            Promise.all([lt, st]).then((result: [{ recruittime: number }, { time: number}]) => {
                const remainingTime = result[0].recruittime - result[1].time;
                console.log('rlt', JSON.stringify(result), remainingTime);
                this.remainingLockTime = Math.max(remainingTime, 0);
            })
        }

        markParameter() {

        }

        selectRecruit(id: string) {
            EventBus.emit(Events.SelectRecruit, parseInt(id));
        }

        showSortDirection() {
            return (this.sortDirection === SortDirection.Down) ? 'ᐯ' : 'ᐱ';
        }

        changeSortDirection() {
            if(this.sortDirection === SortDirection.Down) {
                this.sortDirection = SortDirection.Up;
            } else {
                this.sortDirection = SortDirection.Down;
            }
        }

        setSort(type: SortType): void {
            console.log('set sort', type);
            this.page = 1;
            this.sort = type;
            this.getFreeFighters();
            return;
            /*
            if (this.sort === type) {
                this.changeSortDirection();
            } else {
                this.sort = type;
                this.sortDirection = SortDirection.Down;
            }
             */
        }

        sorted():IFighter[] {
            if(this.sort === this.SortType.Default) return this.list;
            let sorted = this.list.slice();

            if(this.topStats && Options.DEBUG) {
                const _skill = 14;
                sorted = sorted.filter((e) => parseIntE(e.strength) >= _skill && parseIntE(e.dextirity) >= _skill && parseIntE(e.stamina) >= _skill);
            }
            console.log('return sorted');
            return  sorted.sort(SortFunction[this.sort].bind(null, this.sortDirection));
        }

        toggleFold() {
            if(this.folded) {
                this.getFreeFighters();
            }
            this.toggleFoldX(this);
        }
        invite(sid: string) {
            const id = parseInt(sid);
            const index = findById(this.list, id);
            const name = this.list[index].name;

            EventBus.emit(Events.DialogSetMode, IDialogMode.None);
            EventBus.emit(Events.DialogSetHeader, this.l('Confirm'));

            const newText = `Вы уверены, что хотите чтобы ${name} присоединился к вашему клубу?
							 \nОфициальное приглашение стоит $10.`;
            EventBus.emit(Events.DialogSetText, newText);
            EventBus.emit(Events.DialogSetCallback, () => this.sendInvite(id));
            EventBus.emit(Events.DialogShow);
        }
        sendInvite(id: number) {
            // const id = parseInt(sid);
            // const msg = { get: ServerActions.RecruitFighter, id: id };
            // apiMessage(msg)
            recruitFighter(id).then((r: any) => {
                // console.log('invite:', JSON.stringify(r));
                if(r == 1) {
                    const index = findById(this.list, id);
                    const name = this.list[index].name;
                    showSimpleInfoDialog(`Fighter ${name} successfully invited!`);

                    this.getFreeFighters();
                    EventBus.emit(Events.InviteFighter);
                } else {
                    showErrorInfoDialog(r.result);
                }
            });
        }

        getPage(p: number) {
            this.page = p;
            this.getFreeFighters();
        }

        getFreeFighters() {
            /*
            const msg: IMessage = {
                [ServerActions.FreeFighters]: '',
                Page: this.page,
                Order: this.sort
            };
            // apiRequest(ServerActions.FreeFighters)
            apiMessage(msg)
             */
            getFreeFighters(this.page, this.sort)
                .then((r: { [key: number]: IFighter, page: number, pages: number }) => {
                    // console.log('free fighters', r);
                    this.page = r.page;
                    delete r.page;
                    this.pages = r.pages;
                    delete r.pages;

                    let c: IFighter[] = [];
                    // i should be number
                    Object.keys(r).forEach((i: any) => {
                        c.push(<IFighter>r[i]);
                    });

                    this.list = c;
                });
            this.getRecruitLockTime();
        }

        l(textBit: string) {
            return locale(textBit)
        }

        mounted() {
            if(!this.folded) {
                this.getFreeFighters();
            }
            EventBus.on(Events.RecruitScreenToggle, () => {
                this.toggleFold();
            });
            EventBus.on(Events.HireFighter, () => this.getFreeFighters());
        }
    }
</script>

<style scoped>
    .pages span {
        cursor:pointer;
    }
    .pages span.current {
        background-color:white;
        color: black;
    }
    .th {
        overflow:hidden;
    }
    .fixed{
        position:sticky;
        background-color:white;
        color: black;
        font-weight:bold;
        cursor: pointer;
    }
    .header-row{
        display:grid;
        grid-template-columns:1fr repeat(3, 0.5fr) repeat(4, 0.4fr [-th]) min-content;
        grid-template-areas:"n h w a s d st ef act";
        /*width:42vw; */
        grid-area: header;
    }
    .header-row div {
        border:0 dotted gainsboro;
        border-left-width:1px;
        border-bottom-width:1px;
        box-sizing:border-box;

        display:flex;
        align-content:center;
        align-items:center;
        justify-content:center;
        justify-items:center;
    }

    .item-act{
        grid-area:act
    }
    .list{
        width:100%;
        flex-grow:1;
        /* max-height:70vh; */
        overflow-x:visible;
        overflow-y:scroll;
        grid-area: content;
    }

    .screen-wrapper{
        background-color: var(--main-bg-color);

        display:flex;
        flex-direction:column;

        /* height:100%; */
        overflow:auto;

    }
</style>
