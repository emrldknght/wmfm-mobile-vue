<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader header="Summary" :ctx="this"></AppScreenHeader>
            <SummaryScreenHeaderRow
                    :sort="sort"
                    :set-sort="setSort"
                    :show-sort-direction="showSortDirection"
            >
            </SummaryScreenHeaderRow>
            <ListWrapper reset-scroll-dir>
                <template v-for="(fighter, k) in sorted()">
                    <SummaryScreenRow
                            :key="k" :fighter="fighter"
                            :select="selectFighter"
                    ></SummaryScreenRow>
                </template>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import Component from "vue-class-component";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import ListWrapper from "./ListWrapper.vue";
    import {SortDirection, SortFunction, SortType} from "../lib/Recruit";
    import SummaryScreenRow from "./FighterSummary/SummaryScreenRow.vue";
    import SummaryScreenTh from "./FighterSummary/SummaryScreenTh.vue";
    import SummaryScreenHeaderRow from "./FighterSummary/SummaryScreenHeaderRow.vue";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {parseIntE} from "../lib/parseIntE";

    /*
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
     */

    @Component({
        components: {SummaryScreenHeaderRow, SummaryScreenRow, SummaryScreenTh, AppScreenHeader, ListWrapper},
        computed: {
            data() { return this.$store.getters.FIGHTERS; },
        }
    })
    export default class FighterSummary extends AppScreenX{
        // isFolded = false;
        screenName = Screens.Summary;
        // name: "FighterSummary";
        // tH = TH;
        data!: IFighter[];

        sort: SortType = SortType.Default;
        sortDirection = SortDirection.Down;
        SortType = SortType;
        showSortDirection() {
            return (this.sortDirection === SortDirection.Down) ? 'ᐯ' : 'ᐱ';
        }
        setSort(type: SortType) {
            console.log('set sort', type);
            // this.sort = type;

            if (this.sort === type) {
                this.changeSortDirection();
            } else {
                this.sort = type;
                this.sortDirection = SortDirection.Down;
            }
        }
        changeSortDirection() {
            if(this.sortDirection === SortDirection.Down) {
                this.sortDirection = SortDirection.Up;
            } else {
                this.sortDirection = SortDirection.Down;
            }
        }
        sorted():IFighter[] {
            if (this.sort === this.SortType.Default) return this.data;
            let sorted = this.data.slice();

            console.log('return sorted');
            return  sorted.sort(SortFunction[this.sort].bind(null, this.sortDirection));
        }
        selectFighter(sid: string) {
            // console.log('select fighter');
            this.$store.dispatch('SELECT_FIGHTER', parseIntE(sid));
            this.$store.dispatch('GET_SELECTED_FIGHTER_DATA');
            return this.$store.dispatch('GET_SELECTED_FIGHTER_INVENTORY');

        }
        toggleFold() {
            this.toggleFoldX(this);
        }
        mounted() {
            EventBus.on(Events.FightersSummaryScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .screen-wrapper {
        display: flex;
        flex-direction: column;
    }
</style>
