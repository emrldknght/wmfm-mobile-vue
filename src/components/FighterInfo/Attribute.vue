<template>
    <span :class="atClass()">
        {{ l(name()) }} {{ value }}
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";

    @Component({
        props: {
            attr: String,
            value: String
        }
    })
    export default class Attribute extends Vue {
        name() {
            return this.$props.attr;  //.substr(0, 3);
        }
        // name: "Attribute"
        atClass() {
            return `at-${this.name().substr(0, 3)}`;
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .at-str {
        color:lightcoral;
    }
    .at-dex {
        color:lightgreen;
    }
    .at-sta {
        color: lightblue;
    }
</style>
