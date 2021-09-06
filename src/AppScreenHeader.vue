<template>
    <div class="app-screen-header">
                <span class="app-screen-header-text">
                {{header}}
                </span>
        <template v-if="optionsButton">
            <span class="app-screen-header-close"
                @click="ctx.toggleOptions()"
            >&#128295;</span>
        </template>
        <span class="app-screen-header-close" @click="ctx.toggleFold()">X</span>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import {AppScreenX} from "./interfaces/AppScreen/AppScreenX";

    @Component({
        props: {
            // header: String,
            // ctx: Object,
            // optionsButton: Boolean
        }
    })
    export default class AppScreenHeader extends Vue{
        @Prop({ required: true }) readonly header!: string;
        @Prop({ required: true }) readonly ctx!: AppScreenX;
        @Prop() readonly optionsButton!: boolean;

    }
</script>

<style scoped>
    .app-screen-header {
        background-color: var(--app-screen-header-color);
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px;
        /*max-height: 4%;*/
    }
    .app-screen-header-text {
        margin-right: 10px;
        flex-grow: 1;
    }
    .app-screen-header-close {
        margin-left: auto;
        margin-right: 1px;
        height: 3vh;
        width: 3vh;
        border: 1px solid white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .app-screen-header-close:hover {
        background-color: rgba(255,255,255, .3);

    }
</style>
