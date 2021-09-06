<template>
    <span>
        <label>
        {{l('dressedBy')}}:
            <select v-model="ownerFilter">
                <option :value="-1">{{l('all')}}</option>
                <template v-for="[id, name] in owners">
                    <option :value="id">{{name}}</option>
                </template>
            </select>
        </label>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";


    @Component({
        props: {
            owners: Map
        }
    })
    export default class OwnerFilter extends Vue {
        owners!: IFighter[];

        // name: "OwnerFilter"
        ownerFilter = -1;
        getFilter() { return this.ownerFilter }

        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>

</style>
