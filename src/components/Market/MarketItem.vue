<template>
    <div class="item">
        <span class="header">
            <DebugWrapper>[{{item.id}}]</DebugWrapper>
            {{l('seller')}}: {{item.username}}({{item.club}})
        </span>
        <span class="left column">
            <img :src="imgPath(item)" alt="item">
            <span v-if="isArmor(item)">
                <ItemPartsIcon :data="item.bodypart"></ItemPartsIcon>
            </span>
        </span>
        <span class="column" style="grid-area:center">
            <span class="item-header">
                {{item.name}}
                <ItemHistoryButton :item="item"></ItemHistoryButton>
            </span>
            <ItemDisplay :item="item"></ItemDisplay>
        </span>
        <span class="right column">
            <span style="margin-bottom: 10px">
                {{l('price')}}: {{item.sellcost}}
            </span>
            <button @click="buy(item)">{{l('purchase')}}</button>
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component';
    import {IMarketItem} from '../../interfaces/IMarketItem';
    import {Options} from '../../Options';
    import {locale} from "../../Locale";
    import DebugWrapper from "../../DebugWrapper.vue";
    import ItemDisplay from "../Shop/ItemDisplay.vue";
    import ItemHistoryButton from "../Inventory/ItemHistoryButton.vue";
    import {IShopItem} from "../../interfaces/IShopItem";
    import ItemPartsIcon from "../Shop/ItemPartsIcon.vue";
    import {Prop} from "vue-property-decorator";


    @Component({
        components: {ItemHistoryButton, ItemDisplay, DebugWrapper, ItemPartsIcon},
    })
    export default class MarketItem extends Vue {
        @Prop({ required: true }) readonly item!: IMarketItem;
        @Prop({ required: true }) readonly buy!: (item: IMarketItem) => void;
        isArmor(item: IShopItem) {
            return item.class === 'armor';
        }
        imgPath(item: IMarketItem) {
        	return `${Options.serverPath}${item.img}`;
		}
        l(textBit: string) {
            return locale(textBit);
        }

    }
</script>

<style scoped>
    .item-header {
        display: flex;
        flex-direction: row;
    }
    img {
        /*
              width: 10vh;
              height: 10vh;
              */
        background-size: cover;
        border: 1px solid red;
    }
    .header {
        grid-area: header;
        background-color: rgba(255, 255, 255, 0.3);
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
    .item {
        display: grid;
        grid-template-columns: 1fr 3fr 2fr;
        grid-template-rows: 1fr auto;
        grid-template-areas:
                "header header header"
                "left center right";
        margin: 1px;
        border: 1px solid black;
        border-top-width:0;
    }
    .column {
        display: flex;
        flex-flow: column;
    }
</style>
