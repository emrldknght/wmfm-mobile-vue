<template>
    <span style="display:flex">
        <template v-if="isEquipped[item.id] === false">
            <span class="status not-equipped"
                  :title="l('notFullyEquipped')"
                  @click="tapEquipStatus()"
                  @mouseover="calcTooltip"
            >
                [?]
                <span class="status-tooltip" v-text="l('notFullyEquipped')"></span>
            </span>
        </template>
        <span v-if="fatigue(item) > 0">
            F: {{fatigue(item)}}|
        </span>
        <!--
        <template v-if="item.fatigue !== '0'">
            [<span class="fatigue" v-html="fatigueStatus()"></span>]
        </template>
        -->
        <template v-if="item.busy !== '0'">
            <span class="status busy" :title="busyStatus(item)"
                  @click="showCombat(item.busy)"
            >[⚔]</span>
        </template><template v-if="item.inchamp[0] !== ''">
            <span class="status in-champ" :title="item.inchamp.join(',')">[ϯ]</span>
        </template>
        <template v-if="item.trauma">
            <span class="status trauma" :title="traumaStatus(item)">
                <span>
                [+]
                </span>
            </span>
        </template>
        <template v-if="item.transfer !== '0.00'">
            <span class="status transfer">[$]</span>
        </template>
        <template v-if="!item.training && !item.trauma">
            <span class="no-training" title="No active training">[t]</span>
        </template>
    </span>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import {parseIntE} from "../../lib/parseIntE";
    import {locale, localeKey} from "../../Locale";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import {traumaLeft} from "../../lib/traumaLeft";
    import {IEquipState} from "./IEquipState";

    @Component({
        computed: {
            isEquipped() {
                return this.$store.getters.EQUIP_STATE_ALL;
            }
        }
    })
    export default class FighterStatusList extends Vue {
        @Prop({ required: true }) item !: IFighter;
        @Prop({ required:true }) time!: number;
        // @Prop({required: true})
        isEquipped !: IEquipState;

        fatigue(item: IFighter) {
            return Math.max(parseIntE(item.fatigue) - this.time, 0);
        }
        busyStatus(item: IFighter) {
            return localeKey('busyInCombat')(item.busy);
            // return this.l(`Is busy in combat ${item.busy}`);
        }
        tapEquipStatus() {
            // console.log('tapEquipStatus');
        }
        calcTooltip(e: Event) {
            // console.log('over', e.target);
        }
        showCombat(num: string) {
            this.$store.dispatch('SET_CID', parseIntE(num));
            EventBus.emit(Events.ShowCombatWindow);
        }
        traumaStatus(item: IFighter) {
            return item.trauma + '\n' + traumaLeft(item.traumaleft ?? '');
        }

        l(textBit: string) {
            return locale(textBit)
        }
    }
</script>

<style scoped>
    .fatigue {
        --f-size: 3px;
        font-size: var(--f-size);
    }
    sub {
        font-size: var(--f-size);
    }
    sup {
        font-size: var(--f-size);
    }
    .status-tooltip {
        --e-status-bg: white;
        position: absolute;
        background-color: var(--e-status-bg);
        color: black;
        opacity: .9;
        display: none;
        top: 130%;
        padding: 10px;
        border-radius: 5%;
        z-index: 1;
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
    .status-tooltip:hover:before {
        /* border-color: transparent transparent #e6a900 transparent; */
    }
    .not-equipped {
        color:yellow;
        display: inline-flex;
        position: relative;
        justify-content: center;
    }
    .no-training {
        color:mediumvioletred;
    }
    .transfer {
        color: goldenrod;
    }
    .trauma {
        color: red;
    }
    .busy {
        color: sandybrown;
    }
    .in-champ {
        color: #777711;
    }
    .status:hover {
        background-color: #e6a900;
        color:black;
    }
</style>