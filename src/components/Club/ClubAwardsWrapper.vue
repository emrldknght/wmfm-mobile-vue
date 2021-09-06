<template>
    <div>
    <template v-if="data">
        {{l('awards')}}:
        <template v-for="item in data">
            <ClubAward
                    :data="item"
            ></ClubAward>
        </template>
    </template>
    </div>
</template>

<script lang="ts">

    import Vue from "vue";
    import Component from "vue-class-component";
    import ClubAward from "./ClubAward.vue"
    import {locale} from "../../Locale";


    @Component({
        props: {
            data: Array
        },
        components: {ClubAward}
    })
    export default class ClubAwardsWrapper extends Vue {
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>

</style>
