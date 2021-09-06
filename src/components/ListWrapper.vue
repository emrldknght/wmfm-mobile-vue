<template>
    <div class="list-wrapper" :class="{'reset-dir': reset()}" ref="listEl">
       <slot class="list-wrapper-item"></slot>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import IListWrapper from "../interfaces/IListWrapper";
    import ConsoleW from "../lib/ConsoleW";

    @Component({
        props: {
            resetScrollDir: Boolean,
        }
    })
    export default class ListWrapper extends Vue implements IListWrapper{
        reset() {
            return (this.$props.resetScrollDir);
        }
        // name: "ListWrapper"
        getDim() {
            return this.$refs.listEl.getBoundingClientRect();
        }
        scrollToElement(index: number) {

        }

        $refs!: {
            listEl: HTMLElement
        };

        scrollTo(pos: number = -1) {
            const chatDiv = this.$refs.listEl;
            if(chatDiv) {
                if(pos === -1) pos = chatDiv.scrollHeight;
                // console.log('scroll to pos', pos);
                chatDiv.scrollTop = pos;
            } else {
                ConsoleW.error('list Div not defined');
            }
        }
        scrollToBottom() {
            this.scrollTo();
            /*
            const chatDiv = <HTMLElement>this.$refs.listEl;
            if(chatDiv) {
                // console.warn('scroll to bottom', chatDiv.scrollTop, chatDiv.scrollHeight);
                chatDiv.scrollTop = chatDiv.scrollHeight;
            } else {
                ConsoleW.error('list Div not defined');
            }

             */
        }
        mounted() {
            // console.log('refs->',this.$refs);
        }
    }
</script>

<style scoped>
    .list-wrapper * {
        direction: ltr;
    }
    .list-wrapper-item {
        direction: ltr;
    }
    .list-wrapper {
        overflow-y: scroll;
        direction:rtl;
        /*noinspection CssUnknownProperty*/
        scrollbar-width: thin;
    }
    .list-wrapper::-webkit-scrollbar {
        width: 0.2vw;
        height: min-content;
        background-color: #b6b6b6;
    }
    .list-wrapper::-webkit-scrollbar-thumb {
        background: #000;
    }
    .list-wrapper.reset-dir {
        direction: ltr;
    }
</style>
