<template>
    <div class="screen-wrapper ps-wrapper">
        <template v-if="!folded">
            <!--
            <AppScreenHeader :header="l('premiumShop')" :ctx="this"></AppScreenHeader>
            -->
            <div>
                <template v-for="(item, i) in data">
                    <div class="donate-item">
                        <span class="left">
                            <img :src="pictureUrl(item)" :alt="item.name">
                        </span>
                        <span class="center">
                            <DebugWrapper>
                                [{{item.id}}]
                            </DebugWrapper>
                            <b>{{item.name}}</b>
                            <hr>
                            {{item.flavertext}}
                        </span>
                        <span class="right">
                            <span>
                                {{item.cost}}₽
                            </span>
                            <button @click="buy(item)">{{l('purchase')}}</button>
                        </span>
                    </div>
                </template>
            </div>
            <div class="ps-exchange">
                <hr>
                <span>{{l('exchangeMoney')}}:</span>
                <span>{{l('exchangeRate')}}</span>
                <label>
                    <input type="text" v-model="exchange">
                </label>
                <button @click="makeExchange()">{{l('exchange')}}</button>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import AppScreenHeader from "../AppScreenHeader.vue";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import ShopItem from "./Shop/ShopItem.vue";
    import MarketItem from "./Market/MarketItem.vue";
    import ItemDisplay from "./Shop/ItemDisplay.vue";
    import {Options} from "../Options";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import DebugWrapper from "../DebugWrapper.vue";
    import {exchangeHardMoney} from "../api/Premium/exchangeHardMoney";
    import {buyPremiumItem} from "../api/Premium/buyPremiumItem";
    import {IDonateItem} from "./PremiumShop/IDonateItem";
    import {getPremiumItems} from "../api/Premium/getPremiumItems";




    @Component({
        components: {DebugWrapper, ItemDisplay, MarketItem, ShopItem, AppScreenHeader}
    })
    export default class PremiumShopScreen extends AppScreenX{
        screenName = Screens.PremiumShop;

        pictureUrl(item: IDonateItem) {
            return `${Options.serverPath}${item.img}`;
        }

        makeExchange() {
            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            EventBus.emit(Events.DialogSetText, `Вы уверены, что хотите разменять деньги? На рынке, обычно, можно выручить больше.`);

            const ex = () => {
                // const msg = { exchange: this.exchange };
                // apiMessage(<IMessage>msg)
                exchangeHardMoney(this.exchange)
                    .then((result: any) => {
                    console.log('exchange ', result);
                    EventBus.emit(Events.RefreshMoney);
                })
            };

            EventBus.emit(Events.DialogSetCallback, ex);
            EventBus.emit(Events.DialogShow);

        }

        buy(item: IDonateItem) {
            // Вы уверены, что хотите приобрести этот предмет?
            const id = parseInt(item.id);
            const name = item.name;

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            EventBus.emit(Events.DialogSetText, `Вы уверены, что хотите приобрести предмет ${name}?`);

            const purchase = () => {
                // const msg = { buydonate: id };
                // apiMessage(<IMessage>msg)
                buyPremiumItem(id)
                    .then((result: any) => {
                    console.log('purchase ', result);
                    EventBus.emit(Events.RefreshMoney);
                })
            };

            EventBus.emit(Events.DialogSetCallback, purchase);
            EventBus.emit(Events.DialogShow);
        }

        data: IDonateItem[] = [];
        getData() {
            // apiRequest(ServerActions.PremiumShop)
            getPremiumItems()
                .then((result: any) => {
                    this.data = result;
                })
        }
        toggleFold() {
            if(this.folded) {
                this.getData();
                // this.getList();
            }
            this.toggleFoldX(this);
        }

        exchange: number = 0.00;

        mounted() {
            if(!this.folded) {
                //get data
                this.getData();
            }
            EventBus.on(Events.PremiumShopScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .screen-wrapper.ps-wrapper {
        /* max-width: 25vw; */
    }
    .ps-exchange {
        display: flex;
        flex-direction: column;
    }
    .donate-item .left {
        grid-area: l;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .donate-item .center { grid-area: c }
    .donate-item .right {
        grid-area: r;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .donate-item {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        grid-template-rows: auto;
        grid-template-areas: "l c r";
        border: 0 solid white;
        border-bottom-width: 1px;
    }
    .screen-wrapper {
        /* max-width: 35vw; */
        display: flex;
        flex-direction: column;
    }
</style>
