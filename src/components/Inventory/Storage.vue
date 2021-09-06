<template>
    <div style="display: flex; flex-direction: row; align-items: center">
        {{l('overall')}}:&nbsp;
        <span id="storage">
                        <meter
                                low="160"
                                high="280"
                                optimum="90"
                                max="304"
                                :value="inStorage()"
                        ></meter>
                        <span class="counter">{{inStorage()}}/304</span>
                    </span>&nbsp;
        ({{l('Equipped')}}:{{inStorageEq()}})
    </div>
</template>

<script lang="ts">

    import Vue from "vue";
    import Component from "vue-class-component";
    import {locale} from "../../Locale";
    import {IItem} from "../../interfaces/IItem";


    @Component({
        props: {
            itemsData: Array,
            items: Number,
            notEquipped: Number
        }
    })
    export default class Storage extends Vue{
        inStorageEq() {
            // return this.inStorage() - this.$props.notEquipped;
            let count = 0;
            this.$props.itemsData.forEach((cv: IItem) => {
                if(cv.dressed !== '0') count++;
            }, 0);
            return count;
        }
        inStorage() {
            return this.$props.itemsData.length;
        }

        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    #storage {
        position: relative;
        width: max-content;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto;
        grid-template-areas: "main";

        border: 3px double white;
    }
    #storage meter {
        grid-area: main;
    }
    #storage .counter {
        grid-area: main;
        color: black;
        text-align: center;
        font-size: smaller;
        user-select: none;
    }
</style>
