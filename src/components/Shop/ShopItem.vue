<template>
    <div class="item">
        <DebugWrapper>
            <details>
                <summary>data</summary>
                {{ item }}
            </details>
            [{{item.id}}] [{{item.class}}]
        </DebugWrapper>
        <span class="header">
            {{item.name}}
            <ItemHistoryButton :item="item"></ItemHistoryButton>
            <DebugWrapper>{{item.type}} {{isWeapon(item)}}</DebugWrapper>
            <slot></slot>
        </span>
        <span class="left column">
            <img :src="imgPath(item)" alt="item">
            <span v-if="isArmor(item)">
                <ItemPartsIcon :data="item.bodypart"></ItemPartsIcon>
            </span>
        </span>
        <div class="column" style="grid-area:center; position:relative">
            <ItemDisplay :item="item"></ItemDisplay>
        </div>
        <span class="right column">
            <span>{{l('amount')}}: {{ item.amount }}</span>
            <span>
                <button @click="dec()">-</button>
                <label>
                <input v-model.number="toPurchase"
                       minlength="1"
                       :maxlength="amL(item.amount)"
                       :size="amL(item.amount)"
                >
                </label>
                <button @click="inc()">+</button>
            </span>
            <span>{{l('forgery')}}: {{ forgery(item) }}</span>
            <span style="margin-bottom: 10px" v-if="calcPrice(item)">
                {{l('price')}}: {{calcPrice(item)}}$
            </span>
            <button @click="buy(item)" :disabled="!validPurchase(item)">{{l('purchase')}}</button>

        </span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Options} from "../../Options";
    import {IShopItem} from "../../interfaces/IShopItem";
    import {locale} from "../../Locale";
    import {Forge, IForge} from "./IForge";
    import {parseIntE} from "../../lib/parseIntE";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import {IDialogMode} from "../DialogWrapper/IDialogMode";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {processPurchase} from "./processPurchase";
    import {WeaponTypes} from "../../interfaces/WeaponTypes";
    import ItemDisplay from "./ItemDisplay.vue";
    import ItemHistoryButton from "../Inventory/ItemHistoryButton.vue";
    import {buyItem} from "../../api/Shop/buyItem";
    import ItemPartsIcon from "./ItemPartsIcon.vue";

    @Component({
        components: {ItemPartsIcon, ItemDisplay, DebugWrapper, ItemHistoryButton},
        props: {
            item: Object
        }
    })
    export default class ShopItem extends Vue{
        isArmor(item: IShopItem) {
            return item.class === 'armor';
        }

        isWeapon(item: IShopItem) {
            return (item.type) ? Object.values(WeaponTypes).includes((<WeaponTypes>item.type)) : false;
        }

        isShield(item: IShopItem) {
            return item.class === 'shield';
            // return item.type === 'medium' || item.type === 'large' || item.type === 'buckler';
        }

        toPurchase: number = 1;
        forges: IForge = Forge;
        validPurchase(item: IShopItem) {
            return (this.toPurchase <= parseIntE(item.amount, 0)) && (this.toPurchase > 0);
        }
        calcPrice(item: IShopItem) {
            const cost = parseIntE(item.cost, 0) * this.toPurchase ;
            return (!!cost) ? `${cost}` : '';
        }
        amL(amount: number): number {
            return amount.toString().length
        }
        dec() {
            this.toPurchase = Math.max(1, --this.toPurchase);
        }
        inc() {
            this.toPurchase = Math.min(++this.toPurchase, parseInt(this.$props.item.amount));
        }
        buy(item: IShopItem) {
            // dialog
            const withAmount = (amount: number) => ` в количестве ${amount} шт.`;

            const cost = this.calcPrice(item);
            const newText = (amount: number) =>
                `Вы уверены, что хотите приобрести ${item.name}${(amount > 1)? withAmount(amount): ''} за ${cost}$?`;

            /*
            EventBus.emit(Events.DialogSetMode, IDialogMode.None);
            EventBus.emit(Events.DialogSetHeader, this.l('confirmation'));
            */
            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            EventBus.emit(Events.DialogSetText, newText(this.toPurchase));

            const purchase = () => {
                /*
                const msg: IMessage = {
                    [ServerActions.BuyItem]: parseIntE(item.id),
                    master: parseIntE(item.forgery),
                    amount: this.toPurchase,
                };
                ConsoleW.log('will send:', msg);
                apiMessage(msg)
                */
                buyItem(parseIntE(item.id),parseIntE(item.forgery), this.toPurchase)
                    .then((res: any) => processPurchase(res, item));
                    /*
                    .then((res: any) => {
                        console.log(res);
                        if(res === 1) {
                            EventBus.emit(Events.AddItem, item);
                            EventBus.emit(Events.RefreshMoney);
                        } else {
                            showErrorInfoDialog(res.result);
                        }
                    })
                     */
            };


            EventBus.emit(Events.DialogSetCallback, purchase);
            EventBus.emit(Events.DialogShow);

        }
        forgery(item: IShopItem): IForge {
            const f: number = parseIntE(item.forgery);
            return (f !== -1) ? this.forges[f] : '';
        }
        imgPath(item: IShopItem) {
            return `${Options.serverPath}${item.img}`;
        }
        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    button {
        margin:2px;
        padding:4px 8px;
    }

    img{
        /*
        width: 10vh;
        height: 10vh;
         */
        background-size: cover;
        border: 1px solid black;
    }
    .header {
        grid-area: header;
        background-color: rgba(255,255,255,.3);
        display: flex;
        flex-direction: row;
    }
    .left {
        grid-area: left;
        display: flex;
        align-items: center;
        justify-content: center;
        position:relative;
    }
    .right {
        grid-area: right;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .column {
        display: flex;
        flex-flow: column;
    }
    .item {
        display: grid;
        grid-template-columns: 1fr 3fr 2fr;
        grid-template-rows: 1fr auto;
        grid-template-areas:
                "header header header"
                "left center right"
    ;
        margin: 1px;
        border: 1px solid black;
        border-top-width:0;
    }
</style>
