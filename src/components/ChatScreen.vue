<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('chat')" :ctx="this"></AppScreenHeader>
            <DebugWrapper>
                <span>
                    Chat screen <button @click="getMessages()">Get</button>
                    mentions:{{mentions}}
                </span>
            </DebugWrapper>
            <div id="chat-controls">
                <input type="checkbox" v-model="autoScrollToBottom" id="chat-auto-scroll">
                <label for="chat-auto-scroll">{{l('autoScrollToBottom')}}</label>
            </div>
            <ListWrapper ref="chatMessages">
                <template v-for="(item, key) in messages">
                    <ChatMessageItem
                            :id="key"
                            :data="item"
                            :key="key"
                            :cmi="currentMentionId"
                    >
                    </ChatMessageItem>
                </template>
            </ListWrapper>
            <div class="sender">
                <MentionsBubble
                        :mentions="mentions"
                        :current-mention="currentMention"
                        :to-mention="toMention"
                >
                </MentionsBubble>
                <span class="message">
                    <label>
                        <input type="text" v-model="outMessage">
                    </label>
                </span>
                <button @click="sendMessage()">{{l('send')}}</button>
                <button @click="scrollToBottom()">⤓</button>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {IMessage} from "../interfaces/IMessage";
    import {apiMessageChat} from "../lib/AjaxApi";
    import ChatMessageItem from "./Chat/ChatMessageItem.vue";
    import {forceObject} from "../lib/AjaxApi/forceObject";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import ListWrapper from "./ListWrapper.vue";
    import IListWrapper from "../interfaces/IListWrapper";
    import DebugWrapper from "../DebugWrapper.vue";
    import {Watch} from "vue-property-decorator";
    import {IChatMessageItem} from "./Chat/IChatMessageItem";
    import {Mentions, getMentions} from "./Chat/Mentions";
    import {IChatMessage, IChatMessageList} from "./Chat/IChatMessage";
    import MentionsBubble from "./Chat/MentionsBubble.vue";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";

    @Component({
        components: {AppScreenHeader, MentionsBubble, DebugWrapper, ChatMessageItem, ListWrapper},
        computed: {
            state() {
                return this.$store.getters.SCREENS
            }
        }
    })
    export default class ChatScreen extends AppScreenX {
        screenName = Screens.Chat;
        // folded: boolean = false;
        messages: IChatMessageList = {};

        @Watch('messages')
        onUpdateMessages() {
            // console.log('Chat messages updated');
            getMentions(this.messages, this.mentions);
            if(this.autoScrollToBottom) setTimeout(() => this.scrollToBottom(), 1);
        }

        mentions: Mentions = {};
        currentMention = 0;
        currentMentionId = -1;

        // from state
        mentionsReadToId = 0;

        toMention() {
            const chatMessages = this.$refs.chatMessages;
            const keys: number[] = Object.keys(this.mentions).map(e => parseInt(e));
            const cid: number = keys[this.currentMention];

            if(cid) {
                this.currentMentionId = cid;

                const index = this.mentions[cid].index;
                const el: ChatMessageItem & IChatMessageItem = chatMessages.$children[index];
                const box = (typeof el.boxT === 'function') ? el.boxT() : null;

                console.log('call to mention', cid, index, box);

                if(box) {
                    const parentBox = chatMessages.getDim();
                    console.log(parentBox);
                    chatMessages.scrollTo((box.top - box.height * 2) - parentBox.top);
                }

            }
            this.currentMention++;

            if (this.currentMention > Object.keys(this.mentions).length) {
                this.currentMention = 0;
                this.currentMentionId = -1;
                this.$refs.chatMessages.scrollTo(0);
            }
        }

        // chatDiv: HTMLElement | null = null;
        autoScrollToBottom: boolean = true;
        outMessage: string = '';

        getMessages(fromLast = false) {

            const msg: IMessage = {
                // messages: 'get',
                // messid: '' // last 50 w\o id
                // id: 174
            };

            if (fromLast) {
                // console.log('get chat from last');
                const messagesArray = Object.keys(this.messages);
                const lastId = parseInt(messagesArray[messagesArray.length - 1]);
                // console.log('->', lastId);
                if (lastId) msg.id = lastId;
            }

            apiMessageChat(msg).then((res: { [key: string]: IChatMessage } | { result: any }) => {
                // server response array hack
                res = forceObject(res);

                // console.log('chat:', res);

                if (!res.result) {
                    this.messages = {...this.messages, ...res};
                    // this.scrollToBottom();
                } else {
                    // console.error('Request error');
                    EventBus.emit(Events.RequestFailed);
                    return;
                }
            })
        }

        sendMessage() {
            const message: IMessage = {
                name: 'Secret Santa',
                msg: this.outMessage
            };
            apiMessageChat(message).then((res: any) => {
                // console.log(res);
                this.getMessages();
                this.outMessage = '';
            })
        }

        $refs!: {
            chatMessages: ListWrapper & IListWrapper
        };

        scrollToBottom() {
            this.$refs.chatMessages.scrollToBottom();
        }

        toggleFold() {
            if (this.folded) {
                this.getMessages();
            }
            this.toggleFoldX(this);
        }

        mounted() {
            if (!this.folded) {
                this.getMessages(false);
            }
            EventBus.on(Events.ChatScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>

    .screen-wrapper{
        background-color:var(--main-bg-color);
        color:white;
        display:flex;
        flex-direction:column;
        max-width:40vw;
        /*min-width:40vw;*/
    }
    .sender{
        position:relative;
        width:100%;
        display:flex;
        flex-direction:row;
    }
    .message{
        flex-grow:1;
        padding:5px;
    }
    .message input{
        width:100%;
    }
    .message button{
    }
</style>
