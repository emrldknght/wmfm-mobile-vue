<template>
    <span class="fighter-status" v-show="hasStatus()">
        {{ l('Status') }}:
        <template v-if="isBusy()">
            {{ l('Busy') }} [{{data.busy}}]
        </template>
        <template v-if="hasTrauma()">
            <span class="trauma">
                {{ l('Trauma') }}: {{ data.trauma }} [ {{ traumaLeftTime() }} ]
            </span>
        </template>
        <template v-if="onTransfer()">
            {{l('placedToTransfer')}}
        </template>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import {traumaLeft} from "../../lib/traumaLeft";

    @Component({
        props: {
            data: Object
        }
    })
    export default class FighterStatus extends Vue {
        hasStatus() {
            return this.isBusy() || this.hasTrauma() || this.onTransfer();
        }
        isBusy() {
            return this.$props.data.busy !=='0';
        }
        hasTrauma() {
            return this.$props.data.trauma;
        }
        onTransfer() {
            return this.$props.data.transfer !== '0.00';
        }
        data !: IFighter;
        // name: ""
        l(textBit: string) {
            return locale(textBit)
        }
        traumaLeftTime() {
            /*
            const duration = parseInt(this.$props.data.traumaleft);
            const remainingTime = Math.max(duration, 0);

            const hours = seconds => Math.floor(seconds / (60 * 60));
            const minutes = seconds => Math.floor(seconds / 60) % 60;
            const seconds = seconds => seconds % 60;

            const rH = hours(remainingTime);
            const rM = minutes(remainingTime);
            const rS = seconds(remainingTime);

            return `${rH} h ${rM} min ${rS} sec`;
             */

            return traumaLeft(this.data.traumaleft ?? '')
        }
    }
</script>

<style scoped>

</style>