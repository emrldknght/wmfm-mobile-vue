<template>
    <span class="skill-icons">
        <WeaponSetIcon :cat-key="data[0]"></WeaponSetIcon>
        <span class="value">{{data[1]}}</span>
        <template v-if="data[2]">
            <WeaponSetIcon :cat-key="data[2]"></WeaponSetIcon>
            <span class="value">{{data[3]}}</span>
        </template>
        <WeaponSetIcon :cat-key="data[4]"></WeaponSetIcon>
        <span class="value">{{data[5]}}</span>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import WeaponSetIcon from "./WeaponSetIcon.vue";

    @Component({
        props: {
            data: Array
        },
        components: {
            WeaponSetIcon
        }
    })
    export default class SkillTooltip extends Vue{
        // name: "SkillTooltip"
    }
</script>

<style scoped>
    .skill-icons {
        /* display: flex;
        flex-direction: row; */
        /* border: 1px dotted white; */
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: repeat(6, min-content);

        /*
        outline: 1px solid white;
        outline-offset: 1px;
         */
    }
</style>
