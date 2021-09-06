<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('base')" :ctx="this"></AppScreenHeader>
                <div class="sw-header">
                    <DebugWrapper>
                        <span>Current:</span>
                        <span>:{{info.currentbase}}</span>
                    </DebugWrapper>
                    <template v-if="currentInfo()">
                        <TrainingBaseItem :item="currentInfo()" :current="'-1'">
                            <template v-slot:currentItems>
                                    <BaseItemsPanel
                                            :items="currentItems()"
                                            :buy-item="buyItem"
                                            :max-amount="maxAmount"
                                            :base="currentInfo()"
                                    ></BaseItemsPanel>
                                    <!--
                                    <template v-for="(item, key) in currentItems()">
                                        <template v-if="maxAmount(key) > 0">
                                            <div class="base-item-row">
                                                <div style="text-align: right; margin-right: 10px">
                                                {{l(key)}} {{item}}
                                                /
                                                {{maxAmount(key)}}
                                                </div>
                                                <button @click="buyItem(key)">+</button>
                                            </div>
                                        </template>
                                    </template>
                                    -->
                            </template>
                        </TrainingBaseItem>
                    </template>
                    <div class="sw-tickets">
                        {{l('ticketPrice')}}: {{ currentTicketCost() }}
                        <button @click="setTicketCost()">{{l('change')}}</button>
                    </div>
                </div>

                <div class="sw-transfer-list">
                    Transfer:
                    <DebugWrapper><button @click="toggleTransfer">[show]</button></DebugWrapper>
                    <template v-if="showTransfer">
                        <ListWrapper class="sw-transfer-list-items" :class="{show: showTransfer}">
                            <template v-for="(item, i) in baseList()">
                                <TrainingBaseItem :item="item" :key="i" :current="currentId()">
                                    <template v-slot:buyBase v-if="item.id !== currentId()">
                                        <div>
                                            <button @click="changeBaseTo(item.id)">
                                                {{l('transfer')}} [{{item.cost}}$]
                                            </button>
                                        </div>
                                    </template>
                                </TrainingBaseItem>
                            </template>
                        </ListWrapper>
                    </template>
                </div>

        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import ListWrapper from "./ListWrapper.vue";
    import TrainingBaseItem from "./TrainingBase/TrainingBaseItem.vue";
    import {findById} from "../lib/findById";
    import {parseIntE} from "../lib/parseIntE";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import DebugWrapper from "../DebugWrapper.vue";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import {showErrorInfoDialog} from "./DialogWrapper/showErrorDialog";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {IEquipment} from "./TrainingBase/IEquipment";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {ITrainingBaseState} from "./TrainingBase/ITrainingBaseState";
    import {buyBase} from "../api/TrainingBase/buyBase";
    import {buyBaseEquipment} from "../api/TrainingBase/buyBaseEquipment";
    import {setTicketPrice} from "../api/TrainingBase/setTicketPrice";
    import {getTrainingBaseInfo} from "../api/TrainingBase/getTrainingBaseInfo";
    import BaseItemsPanel from "./TrainingBase/BaseItemsPanel.vue";
    import {localeKey} from "../Locale";

    @Component({
        components: {BaseItemsPanel, AppScreenHeader, DebugWrapper, TrainingBaseItem, ListWrapper},
        computed: {
            state() {
                return this.$store.getters.SCREENS
            }
        }
    })
    export default class TrainingBaseScreen extends AppScreenX{
        screenName = Screens.TrainingBase;
        // folded = false;
        info: ITrainingBaseState = { currentwatchers: -1, currentbase: undefined};
        showTransfer: boolean = true;

        changeBaseTo(sid: string) {
            const id = parseIntE(sid);

            console.log('changeBaseTo', id);
            const newText = `Вы уверены, что хотите переехать?
                             \nВесь инвентарь, который не влезет в новое помещение - пропадет!`;

            EventBus.emit(Events.DialogSetMode, IDialogMode.None);
            EventBus.emit(Events.DialogSetText, newText);

            const doTransfer = () => {
                //apiMessage({ [ServerActions.BuyBase]: id })
                buyBase(id)
                    .then((result: any) => {
                        if(result === 1) {
                            this.getInfo()
                        } else {
                            showErrorInfoDialog('Не удалось переехать! ' + result);
                        }
                    });
            };

            EventBus.emit(Events.DialogSetCallback, doTransfer);
            EventBus.emit(Events.DialogShow);
        }

        currentItems() {
            if(this.info.currentbase) {
                console.log(JSON.stringify(this.info.currentbase));
                const { chair, bench, recliner, coltribune, tribune, sector, container } = this.info.currentbase;

                const items: IEquipment = { chair, bench, recliner, coltribune, tribune, sector, container };
                console.log('2', JSON.stringify(Object.entries(items)));

                let existItems: IEquipment = {};

                Object.entries(items)
                    // .filter(e => parseIntE(e[1]) >= 0)
                    .forEach(e => existItems[e[0]] = e[1])
                ;

                return existItems;
            }
            return undefined;
        }

        buyItem(name: string) {
            // var msg='buyinventory=' + invent;
            // const msg: IMessage = { [ServerActions.BuyBaseEquipment]: name };
            // apiMessage(msg)

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            // const newText = `Вы уверены что хотите приобрести предмет ${this.l(name)} за ${this.currentInfo()[name + 'cost']}?`;

            const cost = this.currentInfo()[name + 'cost'];
            const newText = localeKey('confirmBuyBaseItem')(this.l(name), cost);

            EventBus.emit(Events.DialogSetText, newText);

            const buy = () => buyBaseEquipment(name)
                .then((result: any) => {
                    console.log(result);
                    this.getInfo();
                });
            EventBus.emit(Events.DialogSetCallback, buy);
            EventBus.emit(Events.DialogShow);
        }

        currentTicketCost() {
            return this.info.currentbase?.ticket ?? '';
        }
        setTicketCost() {

            console.log('ticket->', this.info.currentbase?.ticket);
            EventBus.emit(Events.DialogSetMode, IDialogMode.Ticket);

            const newText = `Выберите новую стоимость билета:`;
            EventBus.emit(Events.DialogSetText, newText);

            EventBus.emit(Events.DialogSetCallback, (price: number) => {
                //ticketcost: 15
                // const msg: IMessage = { [ServerActions.SetTicketPrice]: price };
                // apiMessage(msg)
                setTicketPrice(price)
                    .then((result: any) => {
                    if(result === 1) {
                        if(this.info.currentbase) {
                            this.info.currentbase.ticket = price.toString();
                        }
                    } else {
                        showErrorInfoDialog('Error: ticket price not changed!');
                    }
                })
            });

            EventBus.emit(Events.DialogShow);
            // Установлена цена билета!
            //Новая цена билета:
            //     $5.00
        }

        maxAmount(itemKey: string) {
            return this.currentInfo()['max' + itemKey];
        }

        toggleTransfer() {
            this.showTransfer = !this.showTransfer;
        }

        currentInfo() {
            const index = findById(this.baseList(), parseIntE(this.currentId()));
            return this.baseList()[index];
        }
        currentId() {
            return this.info.currentbase?.baseid;
        }

        baseList() {
            return Object.entries(this.info)
                .filter((e: any) => parseInt(e[0]))
                .map((e: any) => e[1]);
        }

        getInfo() {
            // http://wmfm.ru/a.php?feature=mobile&BaseList
            // apiRequest(ServerActions.TrainingBaseInfo);
            getTrainingBaseInfo().then((result: ITrainingBaseState) => {
                this.info = result;
            })
        }

        toggleFold() {
            if(this.folded) {
                this.getInfo();
            }
            this.toggleFoldX(this);
        }

        mounted() {
            if(!this.folded) {
                this.getInfo();
            }
            EventBus.on(Events.TrainingBaseScreenToggle, () => this.toggleFold());
        }
    }
</script>

<style scoped>
    .sw-tickets {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .sw-header {
        grid-area:info;
    }
    .sw-transfer-list {
        grid-area:list;
        overflow:hidden;
    }
    .sw-transfer-list-items {
        height:0;
    }
    .sw-transfer-list-items.show {
        height:95%;
    }
    .screen-wrapper {
        max-width: 35vw;

        /*display: flex;
        flex-direction: column;

        background-color: greenyellow;
        color:black;
         */

        display:grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content max-content auto;
        grid-template-areas: "header" "info" "list";
    }
</style>
