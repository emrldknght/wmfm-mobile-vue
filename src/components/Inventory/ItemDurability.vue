<template>
    <span v-if="item"
            class="dur-bar" style="pointer-events:none" :class="remDurClass(item)">
        {{ item.durability }}/{{ item.maxdurability }}
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {IItem} from "../../interfaces/IItem";
    import {parseIntE} from "../../lib/parseIntE";

    @Component({
        props: {
            item: Object
        }
    })
    export default class ItemDurability extends Vue{
        item!: IItem;
        // name: "ItemDurability"
        remDurClass(item: IItem) {
            const d = this.remDur(item);
            let level = 0;

            if(d >= 1) level = 1;
            if(d >= 3) level = 2;
            if(d >= 5) level = 3;
            if(d >= 7) level = 4;

            return `dur-${level}`;
        }
        remDur(item: IItem): number {
            const cur = parseIntE(item.durability, 0);
            const max = parseIntE(item.maxdurability, 0);
            if(cur && max) {
                return Math.floor(cur / max * 10);
            }
            return 0;
        }
    }
</script>

<style scoped>
    .dur-bar {
        /*
        position: absolute;
        bottom: 2px;
        left: 2px;
         */
        background-color: gray;
        font-size: smaller;
        width:100%;
        text-align:center;

    }
    .dur-0 { background-color:black; color:white }
    .dur-1 { background-color:red }
    .dur-2 { background-color:orangered; }
    .dur-3 { background-color:#a0a000;}
    .dur-4 { background-color:green}
</style>
