import {MessageClass} from "./Messages/IStatusMessage";
<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('messages')" :ctx="this"></AppScreenHeader>
            <DebugWrapper>
                <span>
                    <button @click="getMessages()">Get</button>
                    <button @click="checkViewport()">Check</button>
                    {{vp}}
                </span>
            </DebugWrapper>
            <br>
            <ListWrapper reset-scroll-dir ref="allMessages">
                <template v-for="(item, id) in messages">
                    <MessageItem :id="id" :data="item" :key="id"></MessageItem>
                </template>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import ListWrapper from "./ListWrapper.vue";
    import IListWrapper from "../interfaces/IListWrapper";
    import DebugWrapper from "../DebugWrapper.vue";
    import {Watch} from "vue-property-decorator";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {IStatusMessage, MessageClass} from "./Messages/IStatusMessage";
    import {getGameMessages} from "../api/getGameMessages";
    import MessageItem from "./Messages/MessageItem.vue";
    import {GlobalTimers} from "../GlobalTimers";

    interface IGameMessages {
        [id: string]: IStatusMessage
    }

    @Component({
        components: {MessageItem, AppScreenHeader, DebugWrapper, ListWrapper},
        computed: {
            state() {
                return this.$store.getters.SCREENS
            }
        }
    })
    export default class MessagesScreen extends AppScreenX {
        screenName = Screens.Messages;

        // folded: boolean = false;
        // messages: string = '<div>Empty</div>';
        messages: IGameMessages = {};


        @Watch('messages')
        onMessagesUpdate() {
            // console.log('msg updated');
            setTimeout(() => this.scrollToBottom(), 1);
        }

        $refs!: {
            allMessages: ListWrapper & IListWrapper
        };

        scrollToBottom() {
            this.$refs.allMessages.scrollToBottom();
        }

        vp = 'screen';

        checkViewport() {
            this.vp = `${screen.height} : ${window.innerHeight} : ${window.outerHeight}`;
        }

        addMessageClasses(msg: IGameMessages) {

            Object.keys(msg).forEach(key => {
                if(msg[key].msg.match(/^(Бой).+(начался)/gm)) {
                    msg[key].class = MessageClass.CombatStarted;
                }
                if(msg[key].msg.match(/(получил).+(травму)/gm)) {
                    msg[key].class = MessageClass.GotTrauma;
                }
                if(msg[key].msg.match(/(научился)/gm)) {
                    msg[key].class = MessageClass.FinishedTraining;
                }
                if(msg[key].msg.match(/(излечился)/gm)) {
                    msg[key].class = MessageClass.Healed;
                }
            });

            return msg;
        }


        getMessages() {
            /*
            const msg: IMessage = {
                messages: 'get',
                // messid: ''
            };
            apiMessage(msg, true)
            */
            getGameMessages()
                .then((res: IGameMessages) => {
                    res = this.addMessageClasses(res);
                    this.messages = res;
                    // this.scrollToBottom();
                })
        }

        toggleFold() {
            if (this.folded) {
                this.getMessages();
            }
            this.toggleFoldX(this);
        }

        mounted() {
            GlobalTimers.add(this, () => { this.getMessages() });
            if (!this.folded) {
                this.getMessages();
            }
            EventBus.on(Events.MessagesScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .message span:first-child{
        background-color:var(--dim-color);
    }
    .screen-wrapper{
        background-color:var(--main-bg-color);
        display:flex;
        flex-direction:column;
        max-width:40vw;
    }
</style>
