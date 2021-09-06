<template>
    <div class="header-row fixed">
        <template v-for="(cell, i) in tH">
            <SummaryScreenTh
                    :key="i"
                    :text="l(cell[0])"
                    :sort-type="cell[1]"
                    :class-name="cell[2]"

                    :sort="sort"
                    :set-sort="setSort"
                    :sort-direction="showSortDirection"

                    :short="cell[3] || false"
                    :icon-key="cell[4]"
            ></SummaryScreenTh>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {SortType} from "../../lib/Recruit";
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import SummaryScreenTh from "./SummaryScreenTh.vue";
    import {WeaponIconKey} from "../FighterList/WeaponIconKey";

    const TH = [
        ['Fighter', SortType.Name, 'item-n'],
        ['Height', SortType.Height, 'item-h'],
        ['Weight', SortType.Weight, 'item-w'],
        ['Age', SortType.Age, 'item-a'],
        ['Str', SortType.Str, 'item-s', true],
        ['Dex', SortType.Dex, 'item-d', true],
        ['Sta', SortType.Sta, 'item-st', true],
        ['Sword', SortType.Sword, 'item-sword', true, WeaponIconKey.Sword],
        ['Shield', SortType.Shield, 'item-shield', true, WeaponIconKey.Shield],
        ['Blunt', SortType.Blunt, 'item-blunt', true, WeaponIconKey.Blunt],
        ['Bastard', SortType.Bastard, 'item-bastard', true, WeaponIconKey.Bastard],
        ['Polearm', SortType.Polearm, 'item-polearm', true, WeaponIconKey.Polearm],
        ['Wrestling', SortType.Wrestling, 'item-wrestling', true, WeaponIconKey.Wrestling],
        ['Eff', SortType.Eff, 'item-ef', true],
    ];

    @Component({
        props: {
            sort: String,
            setSort: Function,
            showSortDirection: Function,
        },
        components: {
            SummaryScreenTh
        }
    })
    export default class RecruitScreenHeaderRow extends Vue {
        tH = TH;
        // name: "RecruitScreenHeaderRow"
        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    .th {
        overflow:hidden;
    }
    .fixed{
        position:sticky;
        background-color:white;
        color: black;
        font-weight:bold;
        cursor: pointer;

        margin-right: 0.4vw;
    }
    .header-row{
        display:grid;
        grid-template-columns:1fr repeat(3, 0.5fr) repeat(9, 0.4fr [-th]) 0.6fr;
        grid-template-areas:"n h w a s d st sword shield ef";
        /*width:42vw; */
        grid-area: header;
    }
    .header-row div {
        border:0 dotted red;
        border-left-width:1px;
        border-bottom-width:1px;
        box-sizing:border-box;

        display:flex;
        align-content:center;
        align-items:center;
        justify-content:center;
        justify-items:center;
    }
    .item-act{
        grid-area:act
    }
</style>
