<template>
    <div class="tb-item" :class="{active: current === item.id}">
        <span class="tb-column-left">
            <span class="base-pic">
                <img :src="baseImgSrc(item)"
                     alt="base image"
                >
            </span>
            <span class="base-sign">
                [{{item.id}}]{{item.name}}
            </span>
        </span>
        <span class="tb-column-center">
            <span class="ll">
                <span>{{l('attraction')}} {{item.attraction}}</span>
                <span>{{l('square')}} {{item.square}}m<sup>2</sup></span>
                <span>{{l('advSquare')}} {{item.advsquare}}m<sup>2</sup></span>
            </span>
            <span class="rr">
                <span>{{l('fighters')}} {{item.fighters}}</span>
                <span>{{l('watchers')}} {{item.watchers}}</span>
                <span>{{l('dailyRent')}} {{item.rent}}</span>
                <span>{{l('transferCost')}} {{item.cost}}</span>
            </span>
        </span>
        <span class="tb-column-right">
            <span class="tb-column-right-h">
                <span>Items</span>
                <DebugWrapper><span>{{hasCISlot()}}</span></DebugWrapper>
            </span>
            <span class="tb-column-right-l">
                <slot name="currentItems"></slot>
                <slot name="buyBase"></slot>
            </span>
            <span class="tb-column-right-r">
                <template v-if="current !== '-1'">
                    <BaseEquipment name="maxChair" :amount="item.maxchair"></BaseEquipment>
                    <BaseEquipment name="maxBench" :amount="item.maxbench"></BaseEquipment>
                    <BaseEquipment name="maxRecliner" :amount="item.maxrecliner"></BaseEquipment>
                    <BaseEquipment name="maxColTribune" :amount="item.maxcoltribune"></BaseEquipment>
                    <BaseEquipment name="maxTribune" :amount="item.maxtribune"></BaseEquipment>
                    <BaseEquipment name="maxSector" :amount="item.maxsector"></BaseEquipment>
                    <BaseEquipment name="maxContainer" :amount="item.maxcontainer"></BaseEquipment>
                </template>
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {Options} from "../../Options";
    import {ITrainingBase} from "./ITrainingBase";
    import {locale} from "../../Locale";
    import BaseEquipment from "./BaseEquipment.vue";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {Prop} from "vue-property-decorator";

    @Component({
        components: {DebugWrapper, BaseEquipment},
        props: {
            item: Object,
            current: String
        }
    })
    export default class TrainingBaseItem extends Vue{
        @Prop() item!: object;
        @Prop() current!: string;

        hasCISlot() {
            return !!this.$slots.currentItems
        }


        baseImgSrc(el: ITrainingBase): URL {
            return new URL(`${Options.serverPath}img/base/${el.img}`);
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .tb-item img {
        width: 5vw;
        margin: 0;
        padding: 0;
    }
    .tb-item {
        border-bottom: 1px solid black;
        display:grid;
        grid-template-rows: min-content auto;
        grid-template-columns: 1fr 4fr;
        grid-template-areas:
                "left center"
                "right right"
    ;
    }
    .tb-item.active {
        background-color:var(--dim-color);
    }
    .tb-column-left {
        grid-area:left;
        /*
        display:flex;
        flex-direction:column;
        */
        display: grid;
        grid-template-rows: [r0] 3fr [r1] 1fr [r2];
        grid-template-columns: [c0] 3fr [c1] 1fr [c2];
    }
    .base-pic {
        grid-row-start: r0;
        grid-row-end: r2;
        grid-column-start: c0;
        grid-column-end: c2;

        display: flex;
        align-content: center;
        justify-content: center;
    }
    .base-sign {
        grid-row-start: r1;
        grid-row-end: r1;
        grid-column-start: c0;
        grid-column-end: c2;
        background-color: rgba(158,196,196, .7);
    }
    .tb-column-center {
        grid-area:center;
        /*
        display:flex;
        flex-direction:column;
        */

        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: "ll rr";
    }
    .tb-column-center .ll {
        grid-area: ll;
        display: flex;
        flex-direction: column;
        border-right: 1px solid white;
    }
    .tb-column-center .rr {
        grid-area: rr;
        display: flex;
        flex-direction: column;
        padding: 0 4px;
    }
    .tb-column-right {
        grid-area: right;
        /*
        display:flex;
        flex-direction:column;
         */

        display: grid;
        grid-template-rows: max-content auto;
        grid-template-columns: 1fr max-content;
        grid-template-areas:
                "tbcr-header tbcr-header"
                "tbcr-left tbcr-right";
    }
    .tb-column-right-h {
        grid-area: tbcr-header;
    }
    .tb-column-right-l {
        grid-area: tbcr-left;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .tb-column-right-r {
        grid-area: tbcr-right ;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
</style>
