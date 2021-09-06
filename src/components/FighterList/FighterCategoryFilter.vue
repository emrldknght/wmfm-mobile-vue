<template>
    <div class="fcf-wrapper">
        <div style="display: flex; flex-direction: row" tabindex="-1" @click="toggle()" @blur="blur()">
            <template v-if="value === 'all'">
                <span class="fcf-item">
                    <span style="width: 14px; text-align: center; overflow:hidden">All</span>
                </span>
            </template>
            <template v-else>
                <span class="fcf-item">
                    <WeaponSetIcon :cat-key="value"></WeaponSetIcon>
                </span>
            </template>
            <span class="fcf-expand">&#9660;</span>
        </div>
        <div class="fcf-root" v-show="expand">
            <div data-value="all" @click="select($event)">All</div>
            <div data-value="s_sh" @click="select($event)">
                <WeaponSetIcon cat-key="s_sh"></WeaponSetIcon>
            </div>
            <div data-value="m_sh" @click="select($event)">
                <WeaponSetIcon cat-key="m_sh"></WeaponSetIcon>
            </div>
            <div data-value="b_" @click="select($event)">
                <WeaponSetIcon cat-key="b_"></WeaponSetIcon>
            </div>
            <div data-value="p_" @click="select($event)">
                <WeaponSetIcon cat-key="p_"></WeaponSetIcon>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import WeaponSetIcon from "./WeaponSetIcon.vue";
    import {CatFilter} from "./CatFilter";

    @Component({
        components: {WeaponSetIcon}
    })
    export default class FighterCategoryFilter extends Vue{
        // name: "FighterCategoryFilter"
        expand = false;
        value: CatFilter = 'all';
        blur() {
            console.log('blur');
            setTimeout(() => this.expand = false, 150);
        }
        toggle() {
            this.expand = !this.expand;
        }
        select(e: Event) {
            const t = (e.target) as HTMLElement;
            const v = t.dataset.value || t.parentElement?.dataset.value || '_';

            console.log(t, v);

            this.value = v as CatFilter;
            this.expand = false;
        }
    }
</script>

<style scoped>
    .fcf-item {
        flex-grow:1;
        display:flex;
        justify-content:center;
    }
    .fcf-expand {
        background-color: white;
        color: black;
        cursor: pointer;
    }
    .fcf-expand:hover {
        background-color: wheat;
    }
    .fcf-wrapper {
        position: relative;
        margin: 3px;
        display: flex;
        flex-direction: column;

        padding: 1px;
        border: 1px solid white;
        width:50px;
    }
    .fcf-root {
        display: flex;
        flex-direction: column;
        position: absolute;
        background-color: black;
        width: 100%;
        top: 100%;
    }
    .fcf-root div {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        justify-content:center;
    }
    .fcf-root div:hover {
        background-color: #3f3090;
    }
    option[value="all"] {
        background-color: lime;
    }
    option[value="all"]:before {
        content: '1';
        background-color: pink;
        width: 20px;
        height: 20px;
    }
</style>
