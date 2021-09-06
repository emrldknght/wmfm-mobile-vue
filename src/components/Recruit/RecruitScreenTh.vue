<template>
    <div :class="className + ' th'" @click="setSort(sortType)">
        {{ textF() }}
        <template v-if="sort === sortType">{{sortDirection()}}</template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {SortType} from "../../lib/Recruit";
    import {Prop} from "vue-property-decorator";

    @Component({
        props: {
            text: String,
            // sortType: String,
            className: String,

            sort: String,
            // setSort: Function,
            sortDirection: Function,

            short: Boolean
        }
    })
    export default class RecruitScreenTh extends Vue {
        @Prop() sortType!: SortType;
        @Prop() setSort!: (type: SortType) => void;
        textF() {
            return (this.$props.short)
                ? this.$props.text.substring(0, 3)
                : this.$props.text
                ;
        }
    }
</script>

<style scoped>
    .th {
        overflow:hidden;
    }
</style>