<template>
    <span
        :data-group="dataGroup"
        class="row group"
        :class="{last: isLast}"
    >
        <span class="sq" :class="{active: isActive()}">{{l(name)}}</span>
        <span class="row" :class="'e-' + length">
            <slot></slot>
        </span>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {locale} from "../../Locale";

    @Component({
        props: {
            fg: Function,
            name: String,
            dataGroup: String,
            length: Number,
            isLast: Boolean,
            active: String
        }
    })
    export default class ButtonGroup extends Vue {
        // name: "ButtonGroup"
        isActive() {
            return this.$props.active === this.$props.dataGroup;
        }
        l(textBit: string) {
            return locale(textBit, true);
        }
    }
</script>

<style scoped>
    .sq.active {
        background-color: var(--top-button-active-bg-color);
        position: relative;
    }
    .sq.active:after {
        --af-dim: 10px;

        position: absolute;
        z-index: 1;
        right: calc(-1 * var(--af-dim) / 2);
        height: 98%;
        width: calc(var(--af-dim) / 2);

        content: '\0020';
        clip-path: polygon(0 0, 100% 50%, 0 100%);
        background-color: var(--top-button-active-arrrow-bg-color);
        opacity: .5;
        transition: opacity, 300ms;
    }
    .sq.active + span.e-2 {
        max-width: calc(2 * (var(--f-dim-w) + var(--margin-right)));
    }
    .sq.active + span.e-3 {
        max-width: calc(3 * (var(--f-dim-w) + var(--margin-right)));
    }
    .sq.active + span.e-4 {
        max-width: calc(4 * (var(--f-dim-w) + var(--margin-right)));
    }
    .sq.active + span.e-5 {
        max-width: calc(5 * (var(--f-dim-w) + var(--margin-right)));
    }
    .row {
        display:flex;
        flex-direction:row;
    }
    .group {
        border: 1px solid white;
        border-right-width: 0;
    }
    .group.last {
        border-right-width: 1px;
    }
    .sq {
        display: flex;
        align-items: center;
        justify-content: center;


        width: var(--f-dim-w);
        /*
        height: var(--f-dim);
        */

        cursor:pointer;
        user-select: none;
    }
    .sq:after {
        opacity: 0;
        content: '\0020';
    }
    .sq + span {
        /*width: 0;*/
        max-width:0;
        overflow:hidden;

        transition-property: max-width;
        transition-duration: 0.1s;
        transition-timing-function: linear;
    }
    .sq.active + span {
        overflow:hidden;
        width:auto;
    }
</style>
