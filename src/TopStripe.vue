<template>
    <div class="top-stripe">
        <span class="tsb-wrapper">
            <ToggleScreenButtons></ToggleScreenButtons>
        </span>
        <DebugWrapper>
            <button @click="showDialog()">Show Dialog</button>
            <span style="font-size: smaller">
                    DEBUG<br>{{options.DEBUG}}
                </span>
        </DebugWrapper>
        <PlayerInfo></PlayerInfo>
        <button @click="logOut">{{l('Quit')}}</button>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import DebugWrapper from "./DebugWrapper.vue";
    import ToggleScreenButtons from "./components/ToggleScreenButtons.vue";
    import PlayerInfo from "./components/PlayerInfo.vue";
    import {locale} from "./Locale";
    import {Options} from "./Options";
    import {EventBus} from "./EventBus";
    import {Events} from "./Events";
    import {Prop} from "vue-property-decorator";

    @Component({
        /*
        props: {
            logOut: Function,
        },
         */
        components: {
            DebugWrapper,
            ToggleScreenButtons,
            PlayerInfo,
        }
    })
    export default class TopStripe extends Vue{
        @Prop() logOut!:() => void;
        options = Options;
        l(textBit: string) {
            return locale(textBit)
        }
        //
        showDialog() {
            const newText = 'this is sample\ndialog text\nwith line breakers';
            EventBus.emit(Events.DialogSetText, newText);
            EventBus.emit(Events.DialogShow);
        }
    }
</script>

<style scoped>
    .top-stripe {
        grid-area: top-line;
        /* height: 7vh; */
        background-color: var(--main-bg-color);
        color: white;
        display: flex;
        align-items: center;
        /* justify-content: flex-end; */
    }
    .tsb-wrapper {
        display:flex;
        justify-content:flex-start;
        flex-grow: 1;
        overflow-x: hidden
    }
    /*
    @media screen and (orientation: portrait){
        .top-stripe {
            height: 5vh;
        }
    }
     */
    .top-stripe div:first-child {
        justify-self: flex-start;
    }
</style>
