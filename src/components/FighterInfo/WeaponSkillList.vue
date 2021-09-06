<template>
    <span class="section w-skills">
        <span style="grid-area: header">{{l('Skills')}}:</span>
        <span style="grid-area: left">
            <WeaponSkill :name="l('sword')" :skillLevel="data.sword"
                :icon-key="weaponIconKey.Sword"
            ></WeaponSkill>
            <WeaponSkill :name="l('shield')" :skillLevel="data.shield"
                :icon-key="weaponIconKey.Shield"
            ></WeaponSkill>
            <WeaponSkill :name="l('morningStar')" :skillLevel="data.morningstar"
                :icon-key="weaponIconKey.Blunt"
            ></WeaponSkill>
        </span>
        <span style="grid-area: right">
            <WeaponSkill :name="l('bastard')" :skillLevel="data.bastard"
                :icon-key="weaponIconKey.Bastard"
            ></WeaponSkill>
            <WeaponSkill :name="l('poleArm')" :skillLevel="data.polyarm"
                :icon-key="weaponIconKey.Polearm"
            ></WeaponSkill>
            <WeaponSkill :name="l('wrestling')" :skillLevel="data.wrestling"
                :icon-key="weaponIconKey.Wrestling"
            ></WeaponSkill>
        </span>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import WeaponSkill from "./WeaponSkill.vue";
    import {locale} from "../../Locale";
    import {WeaponIconKey} from "../FighterList/WeaponIconKey";

    @Component({
        props: {
            // data: Object
        },
        components: {
            WeaponSkill
        },
        computed: {
            data() { return this.$store.getters.SELECTED_FIGHTER_DATA; },
        }
    })
    export default class WeaponSkillList extends Vue {
        weaponIconKey = WeaponIconKey;
        // name: "WeaponSkillList"
        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    .w-skills {
        display: grid;
        grid-template-rows: 1fr auto;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: "header header" "left right";
    }
</style>
