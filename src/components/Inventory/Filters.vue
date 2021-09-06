<template>
    <fieldset>
        {{l('item')}}:
        <ItemTypeFilterEl
                :filter="itemTypeFilter"
                :types="itemTypes"
                :on-update="itemTypeFilterOnUpdate"
        ></ItemTypeFilterEl>
        <template v-if="itemTypeFilter === itemTypes.Weapon">
            <label>
                {{l('type')}}:
                <ItemTypeFilterEl
                        :filter="weaponTypeFilter"
                        :types="weaponTypes"
                        :on-update="weaponTypeFilterOnUpdate"
                >
                </ItemTypeFilterEl>
            </label>
        </template>
        <template v-if="itemTypeFilter === itemTypes.Armor">
            <label>
                {{l('part')}}:
                <ItemTypeFilterEl
                        :filter="armorPartFilter"
                        :types="armorParts"
                        :on-update="armorPartFilterOnUpdate"
                >
                </ItemTypeFilterEl>
                <slot name="armorSort"></slot>
            </label>
        </template>
        <slot></slot>
    </fieldset>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {ItemTypes} from "../../interfaces/ItemTypes";
    import {WeaponTypes} from "../../interfaces/WeaponTypes";
    import {BodyPart} from "../../interfaces/BodyPart";
    import {IItem} from "../../interfaces/IItem";
    import {filterWeapon} from "./filterWeapon";
    import {filterArmor} from "./filterArmor";
    import {locale} from "../../Locale";
    import DebugWrapper from "../../DebugWrapper.vue";
    import ItemTypeFilterEl from "./ItemTypeFilterEl.vue";
    // import ItemInfo from "./ItemInfo.vue";
    import InventoryItem from "./InventoryItem.vue";

    @Component({
        props: {
            // itemTypeFilter: String
        },
        components: {DebugWrapper, ItemTypeFilterEl, InventoryItem},
    })
    export default class Filters extends Vue {
        itemTypes = ItemTypes;
        weaponTypes = WeaponTypes;
        armorParts = BodyPart;


        itemTypeFilter: ItemTypes = ItemTypes.All;
        weaponTypeFilter: WeaponTypes = WeaponTypes.All;
        armorPartFilter: BodyPart = BodyPart.All;

        itemTypeFilterOnUpdate(filter: ItemTypes) {
            // EventBus.emit(Events.ItemTypeFilterUpdate, newVal);
            this.itemTypeFilter = filter;
        }
        weaponTypeFilterOnUpdate(filter: WeaponTypes) {
            this.weaponTypeFilter = filter;
        }
        armorPartFilterOnUpdate(filter: BodyPart) {
            this.armorPartFilter = filter;
        }

        applyFilter(item: IItem) {
            let filter = true;
            if (this.itemTypeFilter) {
                filter = item.class === this.itemTypeFilter;

                if (this.itemTypeFilter === this.itemTypes.Weapon) {
                    // filter = this._filterWeapon(filter, item);
                    filter = filterWeapon(filter, item, this.weaponTypeFilter);
                }
                if (this.itemTypeFilter === this.itemTypes.Armor) {
                    // filter = this._filterArmor(filter, item);
                    filter = filterArmor(filter, item, this.armorPartFilter);
                }
            }
            return filter;
        }

        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>

</style>
