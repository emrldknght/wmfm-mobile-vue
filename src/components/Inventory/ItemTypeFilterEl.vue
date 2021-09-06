<template>
    <label>
        <select v-model="f">
            <template v-for="(item, key) in types">
                <option :value="item">{{l(key)}}</option>
            </template>
        </select>
    </label>

</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";

    @Component({
        props: {
            filter: String,
            types: Object,
            onUpdate: Function
        },
        computed: {
            f: {
                get: function () {
                    return this.$props.filter;
                },
                set: function (newVal) {
                    this.$props.onUpdate(newVal);
                }
            }
        }
    })
    export default class ItemTypeFilterEl extends Vue{
        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>

</style>
