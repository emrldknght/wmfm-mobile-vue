<template>
    <div class="screen-wrapper wrapper">
        <template v-if="selectedItem">
            <span class="info-header">
                <span style="flex-grow:1">{{selectedItem.name}}</span>
                <span class="close" @click="resetSelection">X</span>
            </span>
            <ItemDisplay :item="selectedItem"></ItemDisplay>
            <hr>
        </template>
        <ListWrapper>
            <template v-for="(item, key) in itemSets">
                <span :key="key" class="item-sets-element">
                    <span>
                        [{{ item.id }}] {{item.name}}
                    </span>
                    <span>{{l('defence')}}: {{item.defence}}</span>
                    <span>{{l('weight')}}: {{item.weight}}</span>
                    <span>{{l('price')}}: {{item.cost}}$</span>
                    <span>{{item.comment}}</span>
                    <span class="item-sets-content">
                        <template v-for="(e, j) in item.armor">
                            <InventoryItem
                                    :item="e"
                                    :key="j"
                                    :hide-indicators="true"
                                    :equip="empty"
                                    :tap="showInfo"
                            ></InventoryItem>
                        </template>
                    </span>
                    <span v-if="item.none">
                        У нашего поставщика нет на складе следующих вещей:
                        <span>{{item.none}}</span>
                        Вы можете приобрести эти вещи у других поставщиков самостоятельно, либо купить на рынке.
                    </span>
                    <span><button @click="buySet(item)">Купить комплект</button></span>
                </span>
                <hr>
            </template>
        </ListWrapper>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {parseIntE} from "../../lib/parseIntE";
    import {IMessage} from "../../interfaces/IMessage";
    import {ServerActions} from "../../lib/ServerActions";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import {IDialogMode} from "../DialogWrapper/IDialogMode";
    import {apiMessage} from "../../lib/AjaxApi";
    import Component from "vue-class-component";
    import ListWrapper from "../ListWrapper.vue";
    import InventoryItem from "../Inventory/InventoryItem.vue";
    import {IItem} from "../../interfaces/IItem";
    import {locale} from "../../Locale";
    import ItemDisplay from "./ItemDisplay.vue";
    import {findById} from "../../lib/findById";

    interface ItemSetAnswer {
        id: string; // "1",
        name: string; // "Легкий комплект",
        weight: string; //"7.68",
        cost: string; //"120.90",
        defence: string; //"40.00",
        things: string; //"65:6:129:95:92",
        comment: string; //"Хороший комплект для начинающих. Чреват травмами, но стоит недорого и вряд ли перегрузит вашего бойца. Ибо он весит... Да ничего, считай, не весит!",
        armor: { [key: string]: IItem };
        none: string;
    }


    @Component({
        components: {
            ItemDisplay,
            ListWrapper,
            InventoryItem
        }
    })
    export default class EquipSetsTab extends Vue {
        itemSets: ItemSetAnswer[] = [];

        allItems() {
            let sum: any = [];

            this.itemSets.forEach((set: ItemSetAnswer) => {
                Object.keys(set.armor).forEach(item => sum.push(set.armor[item]));
            });

            return sum;
        }
        resetSelection() {
            this.selectedItem = null;
        }
        selectedItem: IItem | null = null;
        showInfo(sid: string): void {
            const id = parseIntE(sid);
            console.log(id, typeof id);
            const index = findById(this.allItems(), id);
            console.log(index);
            this.selectedItem = this.allItems()[index];
        }
        empty(): void {}

        buySet(item: ItemSetAnswer) {
            const id = parseIntE(item.id);
            const msg: IMessage = {[ServerActions.BuyItemSet]: id};

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            const newText = `Вы хотите приобрести комплект ${item.name} за ${item.cost}$ ?`;
            EventBus.emit(Events.DialogSetText, newText);

            const buy = () => {
                apiMessage(msg).then((result: any) => {
                    console.log('set purchase result', result);
                })
            };
            EventBus.emit(Events.DialogSetCallback, buy);
            EventBus.emit(Events.DialogShow);

        }

        getItemSets() {
            const msg: IMessage = {
                [ServerActions.ShopItemSets]: ''
            };
            apiMessage(msg).then((result: ItemSetAnswer[]) => {
                console.log(result);
                this.itemSets = result;
            })

        }

        l(textBit: string): string | Function {
            return locale(textBit);
        }

        mounted() {
            this.getItemSets();
        }
    }
</script>

<style scoped>
    .info-header {
        display:flex;
        flex-direction:row;
    }
    .info-header .close {
        --span-dim: 20px;
        width: var(--span-dim);
        height: var(--span-dim);
        cursor:pointer;
        border: 1px solid white;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .info-header .close:hover {
        background-color: var(--dim-color);
    }
    div.wrapper {
        display:flex;
        flex-direction:column;
        /* max-width: 35vw; */
        /*min-width: 34vw;*/
        overflow:auto;
    }

    .item-sets-element{
        display:flex;
        flex-direction:column;
    }
    .item-sets-content{
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
        --box-dim:4vw;
    }
</style>
