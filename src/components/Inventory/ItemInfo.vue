<template>
    <div class="item-info-wrapper" style="display:inherit">
        <DebugWrapper>
            <details>
                <summary style="background-color:pink">data</summary>
                {{ info() }}
            </details>
        </DebugWrapper>
        <span class="row">
            <span class="section info">
                <span class="header">
                    <DebugWrapper>[{{info().id}}]</DebugWrapper>
                    {{ info().name }}
                    <ItemHistoryButton :item="info()"></ItemHistoryButton>
                </span>
                <span v-show="false">
                    {{ l('Class') }} {{ info().class }}
                    {{ l('Type') }} {{ info().type }}
                </span>
                <ItemDisplay :item="info()"></ItemDisplay>
                <!--
                <template v-if="info().class === itemType.Weapon">
                    <span>{{l('damage')}} {{ info().damage }}</span>
                    <span>{{l('speed')}} {{ info().speed }}</span>
                    <span>{{l('length')}} {{ info().length }}</span>
                    <span>{{l('trauma')}} {{ info().trauma }}</span>
                </template>
                <template v-if="info().class === itemType.Armor">
                    <span>{{l('defence')}} {{ info().defence }}</span>
                    <span v-show="false">{{ l('BodyPart') }} {{ bodyPart() }}</span>
                </template>
                <template v-if="info().class === itemType.Shield">
                    <span>{{l('defence')}} {{ info().defence }}</span>
                    <span>{{l('damage')}} {{ info().damage }}</span>
                    <span>{{l('length')}} {{ info().length }}</span>
                    <span>{{l('trauma')}} {{ info().trauma }}</span>
                </template>
                <template v-if="info().class !== itemType.Misc">
                    <span>
                        {{l('durability')}} {{info().durability}}/{{info().maxdurability}}
                    </span>
                    <span>
                        {{l('weight')}} {{info().weight}}
                    </span>
                    <span>
                        {{l('authentic')}} {{info().authentic}}
                    </span>
                    <span>
                        {{l('beauty')}} {{info().beauty}}
                    </span>
                </template>
                -->
                <span v-if="isArmor(info())" style="position: relative">
                    <ItemPartsIcon :data="info().bodypart"></ItemPartsIcon>
                </span>
            </span>
            <span class="section controls">
                <slot></slot>
                <template v-if="info().tosell !== '0'">
                    <button @click="cancelSell()">{{l('cancelSell')}}</button>
                </template>
                <template v-else>
                    <button @click="sellItem()">{{l('sell')}}</button>
                </template>
                <template v-if="canBeRepaired()">
                    <button @click="repairItem()">{{l('repair')}}</button>
                </template>
                <button @click="dropItem()">{{l('drop')}}</button>
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import {findById} from "../../lib/findById";
    import {ItemTypes} from "../../interfaces/ItemTypes";
    import {parseIntE} from "../../lib/parseIntE";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import {IDialogMode} from "../DialogWrapper/IDialogMode";
    import {showSimpleInfoDialog} from "../DialogWrapper/showSimpleInfoDialog";
    import {IItem} from "../../interfaces/IItem";
    import ItemHistoryButton from "./ItemHistoryButton.vue";
    import ItemDisplay from "../Shop/ItemDisplay.vue";
    import {returnItemFromMarket} from "../../api/Inventory/returnItemFromMarket";
    import {placeItemToMarket} from "../../api/Inventory/placeItemToMarket";
    import {IShopItem} from "../../interfaces/IShopItem";
    import ItemPartsIcon from "../Shop/ItemPartsIcon.vue";

    @Component({
        components: {ItemDisplay, ItemHistoryButton, DebugWrapper, ItemPartsIcon},
        props: {
            // index: Number,
            // selectedItemId: Number,
            // items: Array,
            drop: Function,
            repair: Function,
        },
        computed: {
            items() { return this.$store.getters.STORAGE_ITEMS; },
            selectedItemId() { return this.$store.getters.SELECTED_ITEM; },
        }

    })
    export default class ItemInfo extends Vue {
        items!: IItem[];
        selectedItemId!: number;
        itemType = ItemTypes;

        isArmor(item: IShopItem) {
            return this.info().class === 'armor';
        }

        canBeRepaired() {
            const item = this.info();
            const dur = parseIntE(item.durability);
            const max = parseIntE(item.maxdurability);
            return  dur < max ;
        }
        sellItem() {

            const id: number = parseIntE(this.info().id);

            EventBus.emit(Events.DialogSetMode, IDialogMode.Price);
            // EventBus.emit(Events.DialogSetHeader, this.l('confirmation'));

            const itemName = this.info().name;
            // const newText = `Вы уверены что хотите продать предмет ${itemName}?`;
            const newText = `Размещаем предмет ${itemName} на барахолке:`;

            EventBus.emit(Events.DialogSetText, newText);

            EventBus.emit(Events.DialogSetCallback, (price: number) => {
                // const msg: IMessage = { [ServerActions.SellItem]: id, cost: price };
                // apiMessage(msg)
                placeItemToMarket(id, price)
                    .then((res: any) => {
                        const result = parseInt(res);
                        if(result) {
                            this.$store.dispatch('SET_ITEM_SELL_STATUS_A', {id, status: true});
                            EventBus.emit(Events.MarketScreenUpdate);
                            showSimpleInfoDialog(<string>this.l('itemPlacedToMarket'));
                        }
                    })
            });

            EventBus.emit(Events.DialogShow);
        }
        cancelSell() {
            const id: number = parseIntE(this.info().id);
            // const msg: IMessage = { [ServerActions.CancelSell]: id };
            // apiMessage(msg)
            returnItemFromMarket(id).then((res: any) => {

                const result = parseInt(res);
                if(result) {
                    this.$store.dispatch('SET_ITEM_SELL_STATUS_A', {id, status: false});

                    EventBus.emit(Events.MarketScreenUpdate);
                    showSimpleInfoDialog(<string>this.l('itemRemovedFromMarket'));
                }
            })
        }
        repairItem() {
            this.$props.repair(this.selectedItemId);
        }
        dropItem() {
            this.$props.drop(this.selectedItemId);
        }
        info(): IItem {
            if (this.selectedItemId !== -1 && this.items.length > 0) {
                let i = findById(this.items, this.selectedItemId);
                return this.items[i];
            } else {
                return {}
            }
        }
        bodyPart() {
            return this.info().bodypart
                ?.split(',')
                .map(e => this.l(e))
                .join(" ") ?? '';
        }
        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    .section {
        display:flex;
        flex-direction:column;
        padding:2px;
    }
    .section.info {
        grid-area: left;
    }
    .section.controls {
        grid-area:right;
        justify-content:center;
        flex-grow:1;
    }
    .section.controls button {
        flex-grow: 1;
    }
    .header {
        font-weight: bold;
        border-bottom: 1px solid white;
        display: flex;
    }
    .row {
        /*
        display:flex;
        flex-direction:row;
         */

        display:grid;
        grid-template-columns: 5fr 1fr;
        grid-template-rows: auto;
        grid-template-areas:
                "left right"
        ;
    }
    .item-info-wrapper {
        border: 1px solid white;
        border-top: 0;
        color: white;

        display:flex;
        flex-direction:column;
    }
</style>
