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
    export default class RecruitScreenParameter extends Vue{
        name = "RecruitScreenParameter";
        mark() {
            let order: number = parseInt(this.$props.parameter);
            let m = 0;

            // console.log(order, typeof order, Number.isInteger(order));

            if (order >= 10) m = 1;
            if (order >= 15) m = 2;
            if (order >= 18) m = 3;

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
        color:yellow;
    }
    .mark-2 {
        color: greenyellow;
    }
    .mark-3 {
        color: violet;
    }
</style>
