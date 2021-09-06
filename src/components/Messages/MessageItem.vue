import {MessageClass} from "./IStatusMessage";
import {MessageClass} from "./IStatusMessage";
import {MessageClass} from "./IStatusMessage";
<template>
    <span class="message" :key="id">
        <span class="message-icon">
            <template v-if="data.class">
                <span class="icon" :class="data.class"
                    v-html="getIconSign(data)"
                >
                </span>
            </template>
        </span>
        <span class="message-header">
            <DebugWrapper>[{{id}}]</DebugWrapper>
            {{data.time}} : <DebugWrapper>{{data.class}}</DebugWrapper>
        </span>
        <span class="message-text">
            <template v-if="isCombat(data)">
                K: <span @click="showCombat(data)">
                    {{data.msg}}
                </span>
            </template>
            <template v-else>
                {{data.msg}}
            </template>
        </span>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {IStatusMessage, MessageClass} from "./IStatusMessage";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";

    @Component({
        props: {
            id: String,
            data: Object
        },
        components: {
            DebugWrapper
        }
    })
    export default class MessageItem extends Vue{
        getCombatId(item: IStatusMessage): number {
            const text = item.msg;
            const nMatch = text.match(/\d{3,}/gm);
            return (nMatch) ? parseInt(nMatch[0]) : -1;
        }
        showCombat(item: IStatusMessage) {
            const id = this.getCombatId(item);
            if(id > 0) {
                this.$store.dispatch('SET_CID', id);
                EventBus.emit(Events.ShowCombatWindow);
            }
        }
        isCombat(item: IStatusMessage): boolean {
            return item.class === MessageClass.CombatStarted || item.class === MessageClass.CombatResult;
        }
        getIconSign(item: IStatusMessage) {
            switch (item.class) {
                case MessageClass.Finance:
                    return '$';
                case MessageClass.CombatResult:
                    return 'K';
                case MessageClass.CombatStarted:
                    return '&#9876';
                case (MessageClass.GotTrauma):
                case (MessageClass.Healed):
                    return '&#127973;';
                case MessageClass.FinishedTraining:
                    return '&#127891';
                default:
                    return 'No'
            }
        }
        // name: "MessageItem"
        data!: IStatusMessage;
    }
</script>

<style scoped>
    .icon {
        width: var(--icon-dim);
        height: var(--icon-dim);
        margin: 2px;

        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px solid white;
        font-size: 22px;
        line-height: 2px;
    }
    .icon.finished-training {
        background-color: green;
        color: white;
    }
    .icon.healed {
        background-color: green;
        color: white;
    }
    .icon.got-trauma {
        background-color: #902121;
        color: white;
    }
    .icon.combat-started {
        background-color: green;
        color: white;
    }
    .icon.fin {
        background-color: gold;
        color: saddlebrown;
        border-color: saddlebrown;
    }
    .message-icon {
        grid-area: icon;
        display: flex;
        justify-items: center;
        align-items: center;
    }
    .message-header {
        grid-area: header;
        background-color:var(--dim-color);
    }
    .message-text {
        grid-area: text;
    }
    .message{
        --icon-dim: 30px;
        color:white;
        /*
        display:flex;
        flex-direction:column;
         */
        border-bottom:1px solid white;

        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: max-content auto;
        grid-template-areas:
                "icon header"
                "icon text"
        ;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .message span:first-child{

    }
</style>
