<template>
    <div class="cat-icon" :class="catKey"></div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component({
        props: {
            catKey: String
        }
    })
    export default class WeaponSetIcon extends Vue {
        // name: "WeaponSetIcon"
    }
</script>

<style scoped>
    .cat-icon._ {
        display: none;
    }
    .cat-icon.s_ {
        background-image:url("../../img/cat/sword.png");
    }
    .cat-icon.m_ {
        background-image:url("../../img/cat/mace.png");
    }
    .cat-icon.b_ {
        background-image:url("../../img/cat/bastard.png");
    }
    .cat-icon.p_ {
        background-image:url("../../img/cat/polearm.png");
    }
    .cat-icon.m_sh {
        background-image:url("../../img/cat/mace_shield.png");
    }
    .cat-icon.s_sh {
        background-image:url("../../img/cat/sword_shield.png");
    }
    .cat-icon._sh {
        background-image:url("../../img/cat/shield.png");
    }
    .cat-icon.w_ {
        background-image: url("../../img/cat/wrestling.png");
    }
    .cat-icon {
        background-position:center center;
        background-repeat:no-repeat;
        background-size: auto;
        width:14px;
        height:14px;
    }
</style>
