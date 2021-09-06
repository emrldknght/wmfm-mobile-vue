<template>
    <span @click="toggleScreen"
        class="button-wrapper" :class="{'visible' : screenActive() }"
        :data-screen="event || ''">
        <DebugWrapper>{{screen}}.</DebugWrapper>
        <span class="button-text-wrapper">
            <slot></slot>
        </span>
        <DebugWrapper>{{screenActive()}}</DebugWrapper>
    </span>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {EventBus} from "../../EventBus";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {IScreen} from "../../interfaces/IScreen";

    @Component({
        components: {DebugWrapper},
        props: {
            event: String,
            // text: String
            screen: Number,
        },
        computed: {
            state() { return this.$store.getters.SCREENS }
        }
    })
    export default class TButton extends Vue {
        state!: IScreen;
        // name: "TButton"
        // active: boolean = false;
        screenActive() {
            if(!this.state) return false;
            if(!this.state[this.$props.screen]) return false;

            return !this.state[this.$props.screen].folded; //false; //this.active;
        }
        toggleScreen() {
            const event = this.$props.event;
            if(event) {
                EventBus.emit(event);
            }
        }
        mounted() {
            const screen = this.$props.screen;
            /*
            if(screen) {
                const state = this.state[screen]?.folded;
                if(typeof state !== 'undefined') {
                    // this.active = !state;
                }
            }
            if(screen === Screens.FighterProfile) {
                // console.log('Fighter profile hack');
                // this.active = true;
            }
             */
        }
    }
</script>

<style scoped>
    .button-wrapper {

    }
    .button-wrapper.visible {
        background-color:var(--dim-color);
        outline: 2px solid white;
        outline-offset: -10px;
    }
    .button-text-wrapper {
        /*
        transform-origin:center center;
        transform:rotateZ(45deg);
         */
    }

</style>
