<template>
    <span class="item-history-info" @click.stop="showHistoryInfo()">
        i
    </span>
</template>

<script lang="ts">
    import {showSimpleInfoDialog} from "../DialogWrapper/showSimpleInfoDialog";

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {IItem} from "../../interfaces/IItem";

    @Component({
        props: {
            item: Object
        }
    })
    export default class ItemHistoryButton extends Vue {
        item!: IItem;

        showHistoryInfo() {
            /*
             const i = findById(this.items, this.selectedItemId);
             const data = this.items[i].flavertext ?? '';
             */
            const data = this.$props.item.flavertext ?? '';
            showSimpleInfoDialog(data, false);
        }
    }
</script>

<style scoped>
    .item-history-info {
        width: 1vw;
        height: 1vw;
        border: 1px solid white;
        border-radius: 50%;
        font-weight: normal;
        display: flex;
        /*margin-left: auto;*/

        justify-content: center;
        cursor: pointer;

        margin: 0 5px;
        margin-left: auto;
    }

    .item-history-info:hover {
        background-color: var(--dim-color);
    }
</style>
