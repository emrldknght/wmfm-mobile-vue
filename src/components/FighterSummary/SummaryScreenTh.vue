<template>
    <div :class="className + ' th'" @click="setSort(sortType)">
        <template v-if="iconKey">
            <span style="background-color: var(--main-bg-color)">
                <WeaponSetIcon :cat-key="iconKey"></WeaponSetIcon>
            </span>
        </template>
        <template v-else>
            {{ textF() }}
        </template>
        <template v-if="sort === sortType">{{sortDirection()}}</template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import WeaponSetIcon from "../FighterList/WeaponSetIcon.vue";
    import {Prop} from "vue-property-decorator";

    @Component({
        components: {WeaponSetIcon},
        props: {
            text: String,
            sortType: String,
            className: String,

            sort: String,
            // setSort: Function,
            sortDirection: Function,

            short: Boolean,
            iconKey: String
        }
    })
    export default class SummaryScreenTh extends Vue {
        @Prop() setSort!: (sortType: String) => void;
        textF() {
            return (this.$props.short)
                ? this.$props.text.substring(0, 3)
                : this.$props.text
                ;
        }
    }
</script>

<style scoped>

</style>
