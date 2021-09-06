<template>
    <div v-if="Object.keys(mentions).length > 0">
        <div class="mention-bubble" @click="toMention()">
            <template v-if="currentMention === 0">
                {{l('mentions')}}
            </template>
            <template v-else>
                {{currentMention}} from {{Object.keys(mentions).length}}
            </template>
        </div>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";

    @Component({
        props: {
            currentMention: Number,
            mentions: Object,
            toMention: Function
        }
    })
    export default class MentionsBubble extends Vue{
        // name: "MentionsBubble"
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .mention-bubble{
        background-color:rgba(220, 20, 60, .5);
        border-radius:50%;
        display:flex;
        justify-content:center;
        align-items:center;
        cursor:pointer;
        --dim:6vw;
        width:var(--dim);
        height:var(--dim);
        position:absolute;
        z-index:13;
        /*bottom: calc(var(--dim) - 10px);*/
        bottom:125%;
        right:1vw;
    }
    .mention-bubble:hover{
        background-color:rgba(220, 20, 60, .9);
    }
</style>
