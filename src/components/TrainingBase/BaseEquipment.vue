<template>
    <div v-if="notZero()">
        <span>{{l(name)}} {{amount}}</span>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {locale} from "../../Locale";

    @Component({
        props: {
            name: String,
            amount: String
        }
    })
    export default class BaseEquipment extends Vue{
        notZero() {
            return parseInt(this.$props.amount) > 0;
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>

</style>