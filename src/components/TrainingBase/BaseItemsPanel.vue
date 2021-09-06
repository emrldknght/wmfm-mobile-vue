<template>
    <div>
        <template v-for="(item, key) in items">
            <template v-if="maxAmount(key) > 0">
                <div class="base-item-row">
                    <div style="text-align: right; margin-right: 10px">
                        {{l(key)}} {{item}}
                        /
                        {{maxAmount(key)}}
                    </div>
                    <button @click="buyItem(key)">+ [{{itemCost(key)}}$]</button>
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import {Prop} from "vue-property-decorator";

    @Component({
        props: {
            items: Object,
            // buyItem: Function,
            // maxAmount: Function,
            base: Object
        }
    })
    export default class BaseItemsPanel extends Vue {
        @Prop() readonly buyItem!: (key: string) => void;
        @Prop() readonly maxAmount!: (key: string) => number;
        itemCost(key: string) {
            return this.$props.base[key + 'cost'];
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .base-item-row {
        display: grid;
        grid-template-columns: 3.5fr 3fr;
        margin: 0 40px;
    }
</style>
