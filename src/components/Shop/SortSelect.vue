<template>
    <span>
        <label>
            <select v-model="sortVal" @change="changeWrapper">
                <template v-for="(item, key) in sortTypes">
                    <option :value="item">{{l(key)}}</option>
                </template>
            </select>
        </label>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Sort} from "./Sort";
    import {locale} from "../../Locale";

    @Component({
        props: {
            name: String,
            // sortVal: String
            onChange: Function
        }
    })
    export default class SortSelect extends Vue {
        // name: ""

        changeWrapper() {
            if (!this.$props.onChange) return;
            this.$props.onChange(this.$props.name);
        }
        sortTypes = Sort;
        sortVal: Sort = Sort.None;
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>

</style>
