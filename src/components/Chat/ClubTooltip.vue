<template>
    <span class="status-tooltip top" v-show="tt"
          @mouseenter="activateTT('enter')"
          @pointerenter="activateTT('enter')"
          role="button"
          tabindex="0"
    >{{data.clubname}}</span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component({
        props: {
            data: Object
        }
    })

    export default class ClubTooltip extends Vue {
        tt: boolean = false;
        showTT(e: Event) {
            e.preventDefault();
            this.tt = true;
        }

        hideTT(e: Event) {
            if(this.tt) {
                // console.log('hide::', e.target);
                this.tt = false;
            }
        }

        activateTT(m: string) {
            console.log('activate tooltip->', m);
        }
    }
</script>

<style scoped>
    .status-tooltip {
        --e-status-bg: white;
        position: absolute;
        background-color: var(--e-status-bg);
        color: black;
        opacity: .9;
        display: inherit;

        overflow-y: visible;
        white-space: nowrap;

        top: 130%;
        padding: 10px;
        border-radius: 5%;
        z-index: 1;
    }
    .status-tooltip.top {
        top: -260%;
    }
    .status-tooltip:before {
        content: '';
        --triangle-dim: 0.7vw;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 var(--triangle-dim) var(--triangle-dim) var(--triangle-dim);
        border-color: transparent transparent var(--e-status-bg) transparent;
        position: absolute;
        top:calc(-0.7 * var(--triangle-dim));
        left: calc(50% - var(--triangle-dim));
    }
    .status-tooltip.top:before {
        border-width: var(--triangle-dim) var(--triangle-dim) 0 var(--triangle-dim);
        border-color: var(--e-status-bg) transparent transparent transparent;
        top:calc(2.5 * var(--triangle-dim));
    }
    .status-tooltip:hover {
        color: red;
    }

    .status-tooltip:focus .status-tooltip:active {
        color: green;
    }
    .status-tooltip:hover:before {
        /* border-color: transparent transparent #e6a900 transparent; */
    }
</style>