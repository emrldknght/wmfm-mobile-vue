<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('transferHeader')+':'" :ctx="this"></AppScreenHeader>
            <ListWrapper>
                <template v-for="(item, i) in list">
                    <div :key="i" class="transfer-data">
                        <div style="grid-area:header">
                            {{item.name}} [{{item.club}}] {{item.master}}
                        </div>
                        <div class="left">
                            <img :src="options.serverPath + item.img" :alt="l('fighterPortrait')">
                        </div>
                        <div class="center">
                            <span>{{l('Age')}} {{item.age}}</span>
                            <span>{{l('Height')}} {{item.height}}</span>
                            <span>{{l('Weight')}} {{item.weight}}</span>
                            <hr>
                            <span>{{l('Str')}} {{item.strength}}</span>
                            <span>{{l('Sta')}} {{item.stamina}}</span>
                            <span>{{l('Dex')}} {{item.dextirity}}</span>
                        </div>
                        <div class="right">
                            <WeaponSkill :name="l('sword')" :skillLevel="item.sword"></WeaponSkill>
                            <WeaponSkill :name="l('shield')" :skillLevel="item.shield"></WeaponSkill>
                            <WeaponSkill :name="l('morningStar')" :skillLevel="item.morningstar"></WeaponSkill>
                            <WeaponSkill :name="l('bastard')" :skillLevel="item.bastard"></WeaponSkill>
                            <WeaponSkill :name="l('poleArm')" :skillLevel="item.polyarm"></WeaponSkill>
                            <WeaponSkill :name="l('wrestling')" :skillLevel="item.wrestling"></WeaponSkill>
                        </div>
                        <div class="bottom">
                            <template v-if="!isOwned(item)">
                                <button @click="buy(item)">
                                    {{l('transferFor')}} ({{item.transfer}}$)
                                </button>
                            </template>
                            <template v-else>
                                <button @click="cancel(item)">
                                    {{l('transferReturn')}}
                                </button>
                            </template>
                        </div>
                    </div>
                </template>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import ListWrapper from "./ListWrapper.vue";
    import {Options} from "../Options";
    import WeaponSkill from "./FighterInfo/WeaponSkill.vue";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import {parseIntE} from "../lib/parseIntE";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {GlobalTimers} from "../GlobalTimers";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {getTransferFighters} from "../api/Fighter/getTransferFighters";
    import {makeTransfer} from "../api/Fighter/makeTransfer";
    import {returnFighterFromTransfer} from "../api/Fighter/returnFighterFromTransfer";

    @Component({
        components: {AppScreenHeader, ListWrapper, WeaponSkill}
    })
    export default class TransferScreen extends AppScreenX{
        screenName = Screens.Transfer;
        list: IFighter[] = [];
        options = Options;

        isOwned(fighter: IFighter) {
            return parseIntE(fighter.master) === Options.id;
        }

        cancel(item: IFighter) {
            const id = parseIntE(item.id);
            /*
            const msg: IMessage = { [ServerActions.PlaceTransfer]: id, cost: 'return' };
            apiMessage(msg) */
            returnFighterFromTransfer(id)
                .then((res: any) => {
                console.log('return', res);
                this.getList();
            })
        }

        buy(item: IFighter) {
            const newText = `Вы уверены, что хотите приобрести бойца ${item.name} за ${item.transfer}$?`;
            EventBus.emit(Events.DialogSetMode, IDialogMode.None);
            EventBus.emit(Events.DialogSetText, newText);

            const purchase = () => {
                const id = parseIntE(item.id);
                /*
                const msg: IMessage = { [ServerActions.MakeTransfer]: id };
                apiMessage(msg) */
                makeTransfer(id)
                    .then((res: any) => {
                    console.log(res);
                })
            };

            EventBus.emit(Events.DialogSetCallback, purchase);
            EventBus.emit(Events.DialogShow);

        }

        getList() {
            // GetTransferFighters
            /*
            const msg: IMessage = { [ServerActions.TransferFighters]: 1 };
            apiMessage(msg)*/
            getTransferFighters().then(res => {
                console.log(res);
                this.list = res;
            })
        }

        toggleFold() {
            if(this.folded) {
                this.getList();
            }
            this.toggleFoldX(this);
        }
        mounted() {
            GlobalTimers.updaters.push({ ctx: this, cb: () => {
                    this.getList()
                } });
            if(!this.folded) {
                //get data
                this.getList()
            }
            EventBus.on(Events.TransferScreenToggle, () => {
                this.toggleFold();
            });
            EventBus.on(Events.PlaceToTransfer, () => this.getList());
        }
    }
</script>

<style scoped>
    .transfer-data {
        display: grid;
        grid-template-rows: min-content auto auto;
        grid-template-columns: 1fr 2fr 3fr;
        grid-template-areas:
                "header header header"
                "left center right"
                "bottom bottom bottom"
        ;

        border-bottom: 1px solid white;
    }
    .left {
        grid-area:left;
    }
    .center {
        grid-area:center;
        display:flex;
        flex-direction:column;
    }
    .right {
        grid-area:right;
        display:flex;
        flex-direction:column;
    }
    .bottom {
        grid-area:bottom;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    .screen-wrapper {
        max-width: 35vw;
        display: flex;
        flex-direction: column;
    }
</style>
