<template>
    <div class="column">
        <template v-if="showInfoButton">
            <ItemHistoryButton :item="item" class="info-float"></ItemHistoryButton>
        </template>
        <template v-if="item.class !== 'donate'">
            <template v-if="isWeapon(item) || isShield(item)">
                <span>{{l('damage')}}: {{ item.damage }}</span>
                <span>{{l('speed')}}: {{ item.speed }}</span>
                <span>{{l('length')}}: {{ item.length }}</span>
                <span>{{l('trauma')}}: {{ item.trauma }}</span>
            </template>
            <template v-if="isArmor(item) || isShield(item)">
                <span>{{l('defence')}} {{item.defence}}</span>
            </template>
            <template v-if="isArmor(item)">
                <span>{{l('parts')}} {{item.bodypart}}</span>
            </template>
            <hr>
            <span>{{l('durability')}} {{item.durability}}/{{item.maxdurability}}</span>
            <span>{{l('weight')}} {{item.weight}}</span>
            <span>{{l('authentic')}} {{item.authentic}}</span>
            <span>{{l('beauty')}} {{item.beauty}}</span>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {IItem} from "../../interfaces/IItem";
    import {IShopItem} from "../../interfaces/IShopItem";
    import {WeaponTypes} from "../../interfaces/WeaponTypes";
    import {locale} from "../../Locale";
    import ItemHistoryButton from "../Inventory/ItemHistoryButton.vue";

    @Component({
        components: {ItemHistoryButton},
        props: {
            item: Object
        }
    })
    export default class ItemDisplay extends Vue {
        showInfoButton: boolean = false;
        item!: IItem;

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

        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    .info-float {
        position: absolute;
        right: 0;
    }
    .column {
        display: flex;
        flex-flow: column;
        position: relative;
    }
</style>
