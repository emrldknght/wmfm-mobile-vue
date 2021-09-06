<template>
    <div class="weapon-skill-wrapper">
        <template v-if="iconKey">
            <WeaponSetIcon :cat-key="iconKey"></WeaponSetIcon>
        </template>
        <span>{{name}}</span>
        <span :class="showSkill()">{{ skillLevel }}</span>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import WeaponSetIcon from "../FighterList/WeaponSetIcon.vue";

    @Component({
        components: {WeaponSetIcon},
        props: {
            name: String,
            skillLevel: String,
            iconKey: String,
        }
    })
    export default class WeaponSkill extends Vue{
        showSkill() {

            const s = this.$props.skillLevel;
            if (s <= 10) return "s-1";
            if (s <= 20) return "s-2";
            if (s <= 30) return "s-3";
            if (s <= 40) return "s-4";
            if (s <= 50) return "s-5";
            if (s <= 60) return "s-6";
            return "s-7";
        }
    }
</script>

<style scoped>
    .weapon-skill-wrapper {
        /* background-color: var(--main-bg-color); */
        color: white;
        /* display: flex; */
        /*margin: 0 1vw;*/
        display: grid;
        grid-template-columns: min-content 5fr 1fr;
    }
    div span:first-child {
        flex-grow: 1;
    }
    .s-1 { color: red  }
    .s-2 { color: orange }
    .s-3 { color: yellow }
    .s-4 { color: green }
    .s-5 { color: #30d5c8 }
    .s-6 { color: purple }
    .s-7 { color: indigo }
</style>
