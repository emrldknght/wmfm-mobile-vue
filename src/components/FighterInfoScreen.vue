<template>
    <div class="screen-wrapper wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('FView')" :ctx="this"></AppScreenHeader>
            <template v-if="selected !== -1 && data">
                <ListWrapper class="fighter-screen">
                        <div class="section">
                            <FighterItems></FighterItems>
                        </div>
                        <DebugWrapper>
                            <details>
                                <summary>data</summary>
                                <small>
                                    {{ data }}
                                </small>
                            </details>
                        </DebugWrapper>
                        <span class="section col">
                            <span class="char-name">{{ data.name }}</span>
                            <span class="club-name">[ {{l('club')}}: {{ data.club }} ]</span>
                        </span>
                        <span class="section">
                            <FighterStatus :data="data"></FighterStatus>
                        </span>
                        <span class="section">
                            <img width="25px" :src="fighterPortrait()" alt="portrait">
                            <span>{{ l('Age') }} {{ data.age }}</span>
                            <span>{{ l('Height') }} {{ data.height }}</span>
                            <span>{{ l('Weight') }} {{ data.weight }}</span>
                        </span>
                        <span class="section">{{l('Eff')}}:{{data.effectiveness}}</span>
                        <span class="section">
                            <Attribute :attr="attributes.Strength" :value="data.strength"></Attribute>
                            <Attribute :attr="attributes.Dexterity" :value="data.dextirity"></Attribute>
                            <Attribute :attr="attributes.Stamina" :value="data.stamina"></Attribute>
                        </span>
                        <span class="section">
                            {{l('Wins')}} {{ data.win }}
                            {{l('Loses')}} {{ data.lose }}
                        </span>
                        <span class="section">
                            <WeaponSkillList></WeaponSkillList>
                        </span>
                        <span v-show="isOwned()">
                            <span class="section">
                                <FighterTraining></FighterTraining>
                            </span>
                            <span class="section">
                                <button @click="placeTransfer()">{{l('placeTransfer')}}</button>
                            </span>
                            <span class="section">
                                <button class="hire" @click="hireFighter()">{{l('Hire')}}</button>
                            </span>
                        </span>
                </ListWrapper>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import FighterItems from "./FighterInfo/FighterItems.vue";
    import {locale, localeKey} from '../Locale';
    import {Options} from "../Options";
    import FighterTraining from "./FighterInfo/FighterTraining.vue";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import Attribute from "./FighterInfo/Attribute.vue";
    import {IAttributes} from "./FighterInfo/IAttributes";
    import ListWrapper from './ListWrapper.vue';
    import DebugWrapper from "../DebugWrapper.vue";
    import {parseIntE} from "../lib/parseIntE";
    import WeaponSkillList from "./FighterInfo/WeaponSkillList.vue";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {IDialogMode} from "./DialogWrapper/IDialogMode";
    import FighterStatus from "./FighterInfo/FighterStatus.vue";
    import {placeTransfer} from "../api/Fighter/placeTransfer";
    import {hireFighter} from "../api/Fighter/hireFighter";

    @Component({
        components: {
            DebugWrapper,
            AppScreenHeader,
            FighterItems,
            FighterStatus,
            Attribute,
            WeaponSkillList,
            FighterTraining,
            ListWrapper,

        },
        props: {
            updateInventory: Function,
        },
        computed: {
            selected() { return this.$store.getters.SELECTED_FIGHTER; },
            data() { return this.$store.getters.SELECTED_FIGHTER_DATA; },
        }
    })
    export default class FighterInfoScreen extends Vue {
        folded: boolean = false;
        attributes = IAttributes;
        data !: IFighter;

        isOwned() {
            return parseIntE(this.data.master) === Options.id;
        }

        placeTransfer() {
            const id = parseIntE(this.data.id);
            const name = this.data.name;

            EventBus.emit(Events.DialogSetMode, IDialogMode.Price);
            // EventBus.emit(Events.DialogSetHeader, this.l('confirmation'));
            const newText = `Выставить бойца ${name} на трансфер?`;
            EventBus.emit(Events.DialogSetText, newText);

            EventBus.emit(Events.DialogSetCallback, (price: number) => {
                console.log('transfer price', price);

                /*
                const msg: IMessage ={ [ServerActions.PlaceTransfer]: id, cost: price};
                // const msg: IMessage = { get: ServerActions.HireFighter, id };
                apiMessage(msg).
                */
                placeTransfer(id, price)
                    .then((res:any) => {
                        console.log('placed to transfer', res);
                        EventBus.emit(Events.PlaceToTransfer);
                    })
            });
            EventBus.emit(Events.DialogShow);
        }

        hireFighter() {
            const id = parseIntE(this.data.id);
            const name = this.data.name;
            // console.warn('Hire fighter ' + id + ' ' + name);

            EventBus.emit(Events.DialogSetMode, IDialogMode.Confirmation);
            // const newText = `Вы уверены что хотите выгнать бойца ${name}?`;
            const newText = localeKey('confirmHire')(name);
            EventBus.emit(Events.DialogSetText, newText);

            EventBus.emit(Events.DialogSetCallback, () => {
                /* const msg: IMessage = { get: ServerActions.HireFighter, id };
                apiMessage(msg).
                */
                hireFighter(id)
                    .then((res:any) => {
                        console.log('hired', res);
                        EventBus.emit(Events.HireFighter)
                    })
            });

            EventBus.emit(Events.DialogShow);
        }

        toggleFold() {
            this.folded = !this.folded;
        }

        fighterPortrait(): string {
            return (this.data.img) ? Options.serverPath + this.data.img : '';
        }

        traumaDuration() {
            const duration = parseIntE(this.data.trauma_duration);
            const now = Math.floor(Date.now() / 1000);

            const remainingTime = Math.max(duration - now, 0);

            const hours = (seconds: number) => Math.floor(seconds / (60 * 60));
            const minutes = (seconds: number) => Math.floor(seconds / 60) % 60;
            const seconds = (seconds: number) => seconds % 60;

            const rH = hours(remainingTime);
            const rM = minutes(remainingTime);
            const rS = seconds(remainingTime);

            // return remainingTime;
            return `${rH} h ${rM} min ${rS} sec`;
        }

        l(textBit: string) {
            return locale(textBit)
        }

        mounted() {
            EventBus.on(Events.FighterInfoToggle, () => this.toggleFold());
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction:column;
    }
    .trauma {
        color: red;
    }

    .fighter-screen {
        background-color: var(--main-bg-color);
        color: white;

        display: flex;
        flex-direction: column;
        max-width: 32vw;
    }

    .fighter-screen hr {
        border-top: 1px dotted red;
        width: 100%;
        color: transparent;
    }

    .section {
        border-top: 2px dotted rgba(255,255,255, .5);
        padding: 2px 0;
        display: flex;
        justify-items: center;
        align-items: center;
        justify-content: space-around;
        align-content: center;
    }
    .col {
        display: flex;
        flex-direction: column;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
</style>
