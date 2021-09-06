<template>
    <div>
        <!--
        <div class="cat-icon" :class="nKey()"></div>
        -->
        [w={{wKey()}}|t={{currentTraining()}}]
        [m={{maxSkill()}}|t={{currentTraining()}}]
        <WeaponSetIcon :cat-key="nKey()"></WeaponSetIcon>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {IItem} from "../../interfaces/IItem";
    import WeaponSetIcon from "./WeaponSetIcon.vue";
    import {getCategoryCode, getWeaponCode} from "./getCategoryCode";
    import {getOwnedItems} from "./getOwnedItems";
    import {findById} from "../../lib/findById";
    import {parseIntE} from "../../lib/parseIntE";
    import {Prop} from "vue-property-decorator";

    @Component({
        components: {WeaponSetIcon},
        props: {
            // id: String
        },
        computed: {
            fighterItems() {
                return this.$store.getters.STORAGE_ITEMS;
            },
            fighters() {
                return this.$store.getters.FIGHTERS;
            }
        }
    })
    export default class NIcon extends Vue{
        @Prop() id!: string;
        fighterItems!: IItem[];
        fighters!: IFighter[];

        maxSkill() {
            const skills = [
                { key: 's', val: parseIntE(this.fighterData().sword) },
                { key: 'm', val: parseIntE(this.fighterData().morningstar) },
                { key: 'b', val: parseIntE(this.fighterData().bastard) },
                { key: 'p', val: parseIntE(this.fighterData().polyarm) }
            ];

            let maxSkill = { key: 'n', val: -1 };
            skills.forEach(s => {
               if(s.val > maxSkill.val) maxSkill = s;
            });

            return maxSkill.key;
        }

        training() {
            if(this.wKey() === 's' || this.wKey() === 'm') {

            }
        }
        fighterData() {
            const index = findById(this.fighters, parseIntE(this.id));
            return this.fighters[index];
        }
        currentTraining() {
            return this.fighterData().training;
        }
        wKey() {
            const w = this.fighterOwnedItems().find(e => e.class === 'weapon');
            return (w) ? getWeaponCode(w) : null;
        }
        nKey() {
            // return this.cats[this.$props.id];
            return getCategoryCode(this.fighterOwnedItems());
            /*
            let W = '';
            let S = '';
            this.fighterOwnedItems().forEach(item =>{
                if(item.class === 'weapon') {
                    W = (item.type) ? item.type.charAt(0) : '';
                }
                if(item.class === 'shield') {
                    S = 'sh';
                }
            });
            return `${W}_${S}`;
            */
        }
        fighterOwnedItems() {
            return getOwnedItems(this.fighterItems, this.$props.id);
            /*
            return this.fighterItems
                .filter(e => e.dressed === this.$props.id && (e.class === 'weapon' || e.class === 'shield'))
                // .map(e => ({ name: e.name, id: e.id }))
                // .map(e => ({ name: e.name, id: e.id, type: e.type }))
                .map(e => ({ class:e.class, type: e.type }))
                ;
             */
        }
    }
</script>

<style scoped>

</style>
