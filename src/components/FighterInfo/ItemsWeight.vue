<template>
    <span class="weight">
        {{l('itemsWeight')}}:&nbsp;
        <span :class="{'over-weight': isOverMaxWeight()}">
            {{ itemsWeight() }} / {{maxWeight()}}
        </span>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {parseFloatE} from "../../lib/parseFloatE";
    import {parseIntE} from "../../lib/parseIntE";
    import {IItem} from "../../interfaces/IItem";
    import {locale} from "../../Locale";

    @Component({
        computed: {
            data() { return this.$store.getters.SELECTED_FIGHTER_INVENTORY; },
            d() { return this.$store.getters.SELECTED_FIGHTER_DATA },
        }
    })
    export default class ItemsWeight extends Vue {
        data!: IItem[];
        d!: IFighter;
        isOverMaxWeight():boolean {
            return this.itemsWeight() > this.maxWeight();
        }
        itemsWeight(): string {
            return this.data.reduce((acc, cur) => acc + parseFloatE(cur.weight), 0).toFixed(2);
        }
        maxWeight(): string {
            // $maxweight=round($fighter['weight']/3,2)-20+$fighter['stamina'];
            return ((parseFloatE(this.d.weight, 0) / 3) - 20 + parseIntE(this.d.stamina, 0)).toFixed(2);
        }
        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    .weight {
        display:flex;
        flex-direction:row;
    }
    .over-weight {
        color: red;
    }
    .expand-header.not-full {
        background-color: rgba(128, 0, 0, .5);
    }
</style>