<template>
    <div class="club-info-wrapper" :class="{'vertical': vertical}">
        <span class="header">
            {{id()}} {{data.club}}
            <DebugWrapper>
                [{{data.id}}]
                <span class="last-login">
                    {{l('lastLogin')}} {{time()}}
                </span>
            </DebugWrapper>
        </span>
        <span class="column left">
            <ClubBanner :banner-name="data.img"></ClubBanner>
        </span>
        <span class="column center">
            <span>{{l('leader')}}: {{data.name}}</span>
            <span>{{l('rating')}}: {{data.rating}}</span>
            <span>{{l('fighters')}}: {{data.fighters}}</span>

            <span>{{l('combats')}}: {{all()}}</span>

            <span>{{l('winRate')}}: {{  (!isNaN(winRate())) ? winRate().toFixed(0) + '%' : '-'}} </span>

            <span>{{l('win')}}: {{win()}}</span>
            <span>{{l('lose')}}: {{lose()}}</span>
            <!--
            <span>{{l('inGame')}}: {{inGame()}}</span>
            -->
        </span>
        <span class="column right">
            <ClubAwardsWrapper :data="data.awards"></ClubAwardsWrapper>
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    import {locale} from "../../Locale";
    import {number2roman} from "../../lib/numberToRoman";
    import ClubAwardsWrapper from "./ClubAwardsWrapper.vue";
    import DebugWrapper from "../../DebugWrapper.vue";
    import ClubBanner from "./ClubBanner.vue";

    @Component({
        components: {ClubBanner, DebugWrapper, ClubAwardsWrapper},
        props: {
            data: Object,
            k: Number,
            vertical: Boolean
        }
    })
    export default class ClubInfo extends Vue{
        winRate() { return (this.win() * 100) / this.all() }
        all() { return this.win() + this.lose() }
        win() { return parseInt(this.$props.data.win); }
        lose() { return parseInt(this.$props.data.lose); }
        inGame() {
            return this.$props.data.regtime;
        }
        time() {
            const pT = parseInt(this.$props.data.time);
            const now = Math.floor(Date.now() / 1000);
            return `${now - pT}`;
        }
        id() {
            // return number2roman(this.$props.data.id);
            return (this.$props.k)? number2roman(this.$props.k) + '.' : '';
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .club-info-wrapper {
        border-bottom: 1px solid black;
        display: grid;
        grid-template-rows: 1fr 9fr;
        grid-template-columns: 1fr 3fr 4fr;
        grid-template-areas:
                "header header header"
                "left center right"
        ;
    }
    .club-info-wrapper img {

    }
    .club-info-wrapper.vertical {
        /* background-color: gray; */
        grid-template-rows: 1fr 9fr auto;
        grid-template-columns: 2fr 3fr;
        grid-template-areas:
                "header header"
                "left center"
                "right right"
    ;
    }
    .header {
        grid-area: header;
    }
    .left {
        grid-area: left;
    }
    .center {
        grid-area: center;
        display: flex;
        flex-direction: column;
    }
    .right {
        grid-area: right;
    }
</style>
