<template>
    <div style="position: relative">
        <div class="equip-sets">
            Equip sets here:
            <hr>
            <div style="display: flex; flex-direction: row">
                <template v-for="(set, key) in equipSets">
                    <!--
                        {{key}} : {{set}}
                    -->
                    <button @click="showSet(key)" data-disabled="!set">{{ key }}</button>
                </template>
            </div>
            <hr>
            {{selectedSetKey}}
            <template v-if="selectedSet()">
                <DebugFighterItems :data="selectedSet()"></DebugFighterItems>
            </template>
        </div>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import DebugFighterItems from "../FighterInfo/DebugFighterItems.vue";
    import {IEquipSets} from "../FighterInfo/IEquipSets";
    import {getEquipSets} from "../../api/Inventory/getEquipSets";
    import {findById} from "../../lib/findById";
    import {IItem} from "../../interfaces/IItem";

    @Component({
        components: {
            DebugFighterItems
        },
        computed: {
          inv() { return this.$store.getters.STORAGE_ITEMS }
        }
    })
    export default class EquipSets extends Vue {
        // name: "EquipSets"
        inv!: IItem[];
        equipSets: IEquipSets | null = null;
        parseSet(set: string) {
            return (set!== '')
                ? set
                    .split(':')
                    .map(e => {
                        const id = parseInt(e);
                        const index = findById(this.inv, id);
                        const item = (index >= 0)
                            ? this.inv[index]
                            : null
                        ;

                        return item;
                    })
                : null
                ;
        }
        selectedSetKey: keyof IEquipSets | null = null;
        selectedSet() {
            return (this.equipSets && this.selectedSetKey)
                ? this.parseSet(this.equipSets[this.selectedSetKey])
                : null;
        }
        showSet(key: keyof IEquipSets) {
            this.selectedSetKey = key;
        }

        mounted() {
            getEquipSets().then((res: IEquipSets) => {
                delete res.user;
                this.equipSets = res;
            })
        }
    }
</script>

<style scoped>
    button:disabled {
        background-color: #9f9f9f;
    }
    .equip-sets {
        background-color: #3f3090;
        position: absolute;
        top: 0;
        left: 100%;
    }
</style>
