<template>
    <div class="club-banner-main">
        <template v-if="bannerSrc()">
            <img :src="bannerSrc()" :title="l('clubBanner')" :alt="l('clubBanner')">
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {Options} from "../../Options";
    import {locale} from "../../Locale";

    @Component({
        props: {
            bannerName: String
        }
    })
    export default class ClubBanner extends Vue{
        // name: "ClubBanner"
        bannerSrc(): string {
            return (this.$props.bannerName)
                ? `${Options.serverPath}img/clubbanners/${this.$props.bannerName}`
                : '';
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    img { max-width: 5vw; }
</style>
