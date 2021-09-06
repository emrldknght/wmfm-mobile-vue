<template>
    <img class="banner"
         :title="getTitle(item)"
         alt="banner"
         :src="clubBannerPath(item)"
         width="11"
         height="11"
    />
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {clubBanner, getBannerPath} from "./clubBanner";

    @Component({
        props: {
            item: Object,
            path: String
        }
    })
    export default class ClubBannerSmall extends Vue {
        item!: IFighter;
        path!: string;
        getTitle(item: IFighter): string {
            if(item) {
                return item.club || '';
            }
            return '?';
        }

        // name: "ClubBannerSmall"
        clubBannerPath(item: IFighter): string {
            // console.log('small banner:', item);
            //return `${Options.serverPath}img/clubbanners/small/` + item.banner;
            if(item) {
                return clubBanner(item);
            }
            return getBannerPath(this.path);
        }
    }
</script>

<style scoped>
    .banner {
        height: 14px;
    }
</style>
