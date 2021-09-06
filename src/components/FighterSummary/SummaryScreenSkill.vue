<template>
    <span :class="mark()">{{parameter}}</span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component({
        props: {
            parameter: String
        }
    })
    export default class SummaryScreenSkill extends Vue{
        name = "RecruitScreenParameter";
        mark() {
            let order: number = parseInt(this.$props.parameter);
            let m = 0;

            // console.log(order, typeof order, Number.isInteger(order));

            if (order > 10) m = 1;
            if (order >= 20) m = 2;
            if (order >= 30) m = 3;

            return `mark-${m}`;
        }
    }
</script>

<style scoped>
    span {
        /*background-color:darkslategray;*/
    }
    .mark-0 {
        color:red;
    }
    .mark-1 {
        color:orange;
    }
    .mark-2 {
        color: yellow;
    }
    .mark-3 {
        color: green;
    }
</style>
