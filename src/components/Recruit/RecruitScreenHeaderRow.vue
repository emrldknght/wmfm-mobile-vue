<template>
    <div class="header-row fixed">
        <template v-for="(cell, i) in tH">
            <RecruitScreenTh
                    :key="i"
                    :text="l(cell[0])"
                    :sort-type="cell[1]"
                    :class-name="cell[2]"

                    :sort="sort"
                    :set-sort="setSort"
                    :sort-direction="showSortDirection"

                    :short="cell[3] || false"
            ></RecruitScreenTh>
        </template>
        <div class="item-act">
            <button style="opacity: 0">{{l('Invite')}}</button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {SortType} from "../../lib/Recruit";
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import RecruitScreenTh from "./RecruitScreenTh.vue";

    const TH = [
        ['Fighter', SortType.Name, 'item-n'],
        ['Height', SortType.Height, 'item-h'],
        ['Weight', SortType.Weight, 'item-w'],
        ['Age', SortType.Age, 'item-a'],
        ['Str', SortType.Str, 'item-s', true],
        ['Dex', SortType.Dex, 'item-d', true],
        ['Sta', SortType.Sta, 'item-st', true],
        ['Eff', SortType.Eff, 'item-ef', true],
    ];

    @Component({
        props: {
            sort: String,
            setSort: Function,
            showSortDirection: Function,
        },
        components: {
            RecruitScreenTh
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
    }
    .header-row{
        display:grid;
        grid-template-columns:1fr repeat(3, 0.5fr) repeat(4, 0.4fr [-th]) min-content;
        grid-template-areas:"n h w a s d st ef act";
        /*width:42vw; */
        grid-area: header;
    }
    .header-row div {
        border:0 dotted gainsboro;
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