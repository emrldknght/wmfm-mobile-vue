<template>
    <div class="club-award-wrapper">
        <span class="club-award-header" @click="fold()">
            <img :src="src()" alt="award-image">
            {{ data.awadrname }}
        </span>
        <template v-if="showDesc">
            <span class="club-award-desc" v-html="data.awardtext"></span>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {locale} from "../../Locale";
    import {Options} from "../../Options";

    @Component({
        props: {
            data: Object,
        }
    })
    export default class ClubAward extends Vue{
        showDesc: boolean = false;
        fold() {
            this.showDesc = !this.showDesc;
        }
        src() {
            return `${Options.serverPath}img/awards/${this.$props.data.awardimg}`;
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .club-award-header {
        cursor: pointer;
    }
    .club-award-desc {
        font-size: smaller;
    }
    .club-award-wrapper {
        display: flex;
        flex-direction: column;
    }
</style>
