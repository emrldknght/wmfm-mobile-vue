<template>
    <div class="repair-item-element">
        <div class="left">
            <span>
                <DebugWrapper>
                    [{{item.id}}]
                </DebugWrapper>
                {{item.name}}
                {{item.durability}} / {{item.maxdurability}}
            </span>
            <span :class="brokeClass()">
                    {{brokePercent()}}%
                </span>
            <span v-if="item.dressed !== '0'">
                {{l('dressedBy')}} {{dressedTo(item)}}
            </span>
        </div>
        <div class="right">
            {{ l('repairCost')}}: {{ item.repaircost }}
            <button @click="repairItem(item)">{{l('Repair')}}</button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {locale} from "../../Locale";
    import {IItem} from "../../interfaces/IItem";
    import {brokePercent} from "./brokePercent";
    import {Prop} from "vue-property-decorator";

    @Component({
        /*
        props: {
            // item: Object,
            // repairItem: Function,
            // dressedTo: Function,
        },
         */
        components: {
            DebugWrapper
        }
    })
    export default class RepairListItem extends Vue{
        @Prop({ required: true }) readonly item !: IItem;
        @Prop() repairItem!: (item: IItem) => void;
        @Prop() dressedTo!: (item: IItem) => string;
        // name = "RepairListItem";
        brokeClass() {
            const dec = Math.floor(this.brokePercent() / 10);
            let p = 0; // red
            if (dec >= 2) p = 1; // orange
            if (dec >= 4) p = 2; // yellow
            if (dec >= 6) p = 3; // green

            return `brok-${p}`;
        }
        brokePercent(): number {
            return brokePercent(this.$props.item);
            // const num = this.$props.item.durability / this.$props.item.maxdurability;
            // return Math.floor(num * 100); //.toFixed(2); // get2AfterP(num) * 100; //
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .brok-0 { color: red }
    .brok-1 { color: orangered}
    .brok-2 { color: yellow }
    .brok-3 { color: lawngreen }

    .left {
        grid-area: left;
        display:flex;
        flex-direction:column;
    }
    .right {
        grid-area: right;
        display:flex;
        flex-direction:column;
    }
    .repair-item-element {
        border-bottom: 1px solid white;
        display:grid;
        grid-template-columns: 4fr 2fr;
        grid-template-rows: auto;
        grid-template-areas: "left right";
    }
</style>
