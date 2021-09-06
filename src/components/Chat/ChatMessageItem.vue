<template>
    <div class="item-wrapper"
         @mouseup="hideTT"
         @pointerup="hideTT"
         @mouseleave="hideTT"
         ref="root"

         :class="{'active': cmi === parseInt(id)}"
    >
        <span class="row" style="user-select: none">
            <DebugWrapper>
                {{id}}
                {{JSON.stringify(boxT())}}
            </DebugWrapper>
            <span>{{data.time}}</span>
            <DebugWrapper>
                <span>[{{data.clubid}}]</span>
            </DebugWrapper>
            <span class="club-name-wrapper"
                  @mousedown="showTT"
                  @pointerdown="showTT"
            >
                <img class="banner" :title="data.clubname" alt="banner"
                     :src="clubBanner(data)"
                     draggable="false"
                     @contextmenu.stop.prevent="pm"
                />
                <ClubTooltip
                    ref="tooltip"
                    :data="data"
                ></ClubTooltip>
            </span>
            <span>{{data.name}}:</span>
        </span>
        <span class="message-text" v-html="parsedText()"></span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Options} from "../../Options";
    import ClubTooltip from "./ClubTooltip.vue";
    import {IClubTooltip} from "./IClubTooltip";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {IChatMessage} from "./IChatMessage";
    import {Prop} from "vue-property-decorator";

    function preventMenu(event: Event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
    }

    @Component({
        props: {
            // data: Object,
            id: String,
            cmi: Number
        },
        components: {
            DebugWrapper,
            ClubTooltip
        }
    })
    export default class ChatMessageItem extends Vue{
        @Prop() data!: IChatMessage;
        // name: "ChatMessage"
        $refs!: {
            tooltip: ClubTooltip & IClubTooltip,
            root: HTMLElement
        };

        box: DOMRect | null = null;

        boxT() {
            return (this.box) ? { top: this.box.top, height: this.box.height} : null; //.getBoundingClientRect();
        }

        showTT(e: Event) { this.$refs.tooltip.showTT(e); }
        hideTT(e: Event) { this.$refs.tooltip.hideTT(e); }

        parsedText() {
            return this.$props.data.text;
        }

        pm(e: Event) {
            // preventMenu(e);
        }

        clubBanner(item: IChatMessage): string {
            return `${Options.serverPath}img/clubbanners/small/` + item.clubpic;
        }
        mounted() {
            this.box = this.$refs.root.getBoundingClientRect();
        }
    }
</script>

<style scoped>
    .message-text::selection {
        background: #e6a900;
        color:black;
    }
    .club-name-wrapper {
        position:relative;
        width:min-content;
        display: flex;
        justify-content: center;
        /*pointer-events: none;*/
    }
    div.item-wrapper {
        border: 1px solid black;
        border-top:0;

        margin:2px;
        position:relative;
        display:flex;
        flex-direction:column;
    }
    .item-wrapper.active {
        background: rgba(218,165,32, .5);
    }
    .row {
        display:flex;
        flex-direction:row;
    }
    .banner {
        height:14px;
    }
    /*  */

</style>
