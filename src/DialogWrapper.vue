<template>
    <div class="wrapper" v-show="show">
            <div class="message" :class="currentMode">
                <div class="header">
                    <span class="name">{{header}}</span>
                    <span class="close" @click="close()">🞪</span>
                </div>
                <div class="body" :class="{'pre': pre }">{{text}}</div>

                <template v-if="(currentMode === modes.Price) || (currentMode === modes.Ticket)">
                    <div class="price">
                        <label for="dw-item-price">{{l('price')}}</label>:<input v-model="price" id="dw-item-price">
                        {{l('use [.] for decimals')}}
                        <br>
                        <template v-if="!validPrice()">
                            <div class="error-price">{{l('invalidPrice')}}</div>
                        </template>
                    </div>
                </template>

                <div class="controls">
                    <span>
                        <template v-if="currentMode === modes.Price">
                            <button @click="ok()" :disabled="!validPrice()">{{l('ok')}}</button>
                        </template>

                        <template v-else>
                            <button @click="ok()">{{l('ok')}}</button>
                        </template>
                    </span>

                    <span v-if="showCancelButton">
                        <button @click="cancel()">{{l('cancel')}}</button>
                    </span>
                </div>
            </div>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {EventBus} from "./EventBus";
    import {Events} from "./Events";
    import {locale} from "./Locale";
    import {IDialogMode} from "./components/DialogWrapper/IDialogMode";
    import ConsoleW from "./lib/ConsoleW";

    const DefaultHeader = 'Dialog header!';
    const DefaultText = 'Dialog\nWrapper';
    const DefaultCallBack = () => { ConsoleW.log('Dialog Ok!'); };

    @Component({})
    export default class DialogWrapper extends Vue{
        show: boolean = false;

        modes = IDialogMode;
        currentMode: IDialogMode = IDialogMode.None;

        header: string = DefaultHeader;
        text: string = DefaultText;
        callback: Function = DefaultCallBack;
        showCancelButton: boolean = true;

        closeInSeconds: number = 0;
        pre: boolean = false;

        //sellItem mixin
        price: number = 1;
        // \sellItem mixin
        validPrice() {
            return this.price.toString().match(/^\d+([.]\d{0,2})?$/);
        }

        reset() {
            this.currentMode = this.modes.None;

            this.header = DefaultHeader;
            this.text = DefaultText;
            this.callback = DefaultCallBack;
            this.showCancelButton = true;
            this.pre = false;
        }

        ok() {
            const withPrice =
                (this.currentMode === this.modes.Price) ||
                (this.currentMode === this.modes.Ticket);

            if(withPrice) {
                this.callback(this.price);
            } else {
                this.callback();
            }
            this.close();
        }

        cancel() {
            this.close();
        }

        open() {
            if(this.header === DefaultHeader) {
                console.warn('Header is not set - default will be used');
            }
            this.show = true;
            if(this.closeInSeconds > 0) {
                setTimeout(() => { this.close() }, this.closeInSeconds * 1000);
            }
        }
        close() {
            this.reset();
            this.show = false;
        }
        setHeader(text: string) {
            this.header = text;
        }
        setText(text:string) {
            this.text = text;
        }
        setMode(mode: IDialogMode) {
            this.currentMode = mode;
            if(mode === IDialogMode.Confirmation || mode === IDialogMode.Price) {
                this.header = <string>this.l('confirmation');
            }
            if(mode === IDialogMode.Info) {
                this.showCancelButton = false;
                this.header = <string>this.l('info');
            }
            if(mode === IDialogMode.Error) {
                this.showCancelButton = false;
                this.header = <string>this.l('error');
            }
        }

        setCloseTimer(seconds: number) {
            this.closeInSeconds = seconds;
        }

        setCallback(f: Function) {
            this.callback = f;
        }

        l(textBit: string) {
            return locale(textBit)
        }

        mounted() {
            EventBus.on(Events.DialogShow, () => this.open());
            EventBus.on(Events.DialogHide, () => this.close());
            EventBus.on(Events.DialogSetHeader, (text: string) => this.setHeader(text));
            EventBus.on(Events.DialogSetText, (text: string) => this.setText(text));
            EventBus.on(Events.DialogSetCallback, (f: Function) => this.setCallback(f));
            EventBus.on(Events.DialogSetMode, (m: IDialogMode) => this.setMode(m));
            EventBus.on(Events.DialogSetPre, (pre: boolean) => this.pre = pre);
        }
    }
</script>

<style scoped>
    button {
        padding:0;
        margin:0;
        background-color:#9f9f9f;
        color:black;

        border:1px solid transparent;
    }
    button:hover {
        background-color:transparent;
        border:1px solid black;
        transition: border-width, 500ms;
    }


    .price {
        padding:5px;
    }
    .price .error-price {
        margin-top: 5px;
        color:red;
    }
    .controls {
        display:flex;
    }
    .controls span {
        margin: 0.5vw;
        background-color:#e6a900;
        min-width:6vw;
        min-height:4vh;

    }
    @media (orientation: landscape) and (max-width: 1025px){
        .controls span{
            margin: 1vw;
            min-width:8vw;
            min-height:6vh;
        }
    }
    @media (orientation: portrait) and (max-width: 1000px){
        .controls span{
            margin: 1vw;
            min-width:12vw;
            min-height:3vh;
            /*background-color:lime;*/
        }
    }
    .controls span button {
        width:100%;
        height:100%;
    }
    .name {
        flex-grow: 1;

    }
    .close {
        cursor:pointer;
        border:1px solid transparent;

        width: 1vw;
        height:1vw;

        display:flex;
        justify-content:center;

    }
    .close:hover {
        border:1px solid black;
        transition: border-width, 500ms;
    }
    .header {
        background-color:var(--dialog-header-bg-color);
        display:flex;
        flex-direction:row;
        padding:5px;
    }
    .m-error .header {
        background-color: rgba(200, 0, 0, .4);
    }
    .m-info .header {
        background-color: rgba(0, 200, 0, .5);
    }
    .body {
        padding:5px;
        word-wrap:break-word;

    }
    .pre {
        white-space:pre;
    }
    .message {
        background-color: var(--dialog-message-bg-color);
        color:white;
        width:40vw;
        height:max-content;

        border:1px solid white;
        padding:5px;

    }
    .wrapper {
        position:absolute;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0, .7);
        width:100%;
        height:100%;
        overflow:hidden;
        display:flex;
        z-index: 667;

        justify-content:center;
        align-items:center;

    }
</style>
