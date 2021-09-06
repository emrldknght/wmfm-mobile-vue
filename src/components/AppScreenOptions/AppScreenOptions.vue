<template>
    <div v-if="showOptions">
        <div class="options-root">
            <div class="options-content">
                <!--
                <button @click="load">Get</button>
                -->
                <DebugStoredData></DebugStoredData>
                [{{ctx}}] Options component
                <hr>
                stored: {{ storedOptions }}
                <hr>
                all: {{allOptions()}}
                <hr>
                <div style="display:flex; flex-direction:column">
                    <template v-for="(option, key) in allOptions()">
                        <div class="options-item">
                            <template v-if="option.type === 'bool'">
                                Bool:{{option}}<br>
                                <label>
                                    <input
                                        type="checkbox"
                                        :checked="optionValue(option.name, option.value)"
                                        @change="setBoolOption(option.name, $event)"
                                    >
                                </label>
                            </template>
                            <template v-if="option.type === 'text'">
                                Text:{{option}}<br>
                                <label>
                                    <input
                                        type="text"
                                        :value="optionValue(option.name, option.value)"
                                        @change="setTextOption(option.name, $event)"
                                    >
                                </label>
                            </template>
                            <template v-if="option.type === 'radio'">
                                Radio:{{option}}<br>
                                    <template v-for="v in option.values">
                                        <label>
                                            <input
                                                type="radio"
                                                name=""
                                                :value="v"
                                                :checked="optionRadioValue(option.name, v, option.value)"
                                                @change="setRadioOption(option.name, $event)"
                                            >
                                            {{ v }}:{{optionRadioValue(option.name, v, option.value)}}
                                        </label><br>
                                    </template>
                            </template>
                            <template v-if="option.type === 'list'">
                                Select:{{option}}<br>
                                <label>
                                    <select @change="setSelectOption(option.name, $event)">
                                        <option value="" :selected="'' === option.value"></option>
                                        <template v-for="item in option.values">
                                            <option :value="item[0]" :selected="optionListValue(option.name, item[0], option.value)">
                                                {{item[1]}}
                                            </option>
                                        </template>
                                    </select>
                                </label>
                            </template>
                        </div>
                        <!--
                        <template v-else>
                            <div>Else: {{key}}:{{value}}[{{typeof value}}]</div>
                        </template>
                        -->
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import {Screens} from "../../interfaces/AppScreen/Screens";
    import DebugStoredData from "../DebugStoredData.vue";
    // import TButton from "../components/ToggleScreenButtons/TButton.vue";
    import {ScreenOptions, TScreenOptions} from './ScreenOptions';
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";

    const NO_VAL = '#?';

    @Component({
        components: {
            // TButton,
            DebugStoredData
        },
        computed: {
            storedOptions() {
                return this.$store.getters.SCREEN_OPTIONS
            }
        }
    })
    export default class AppScreenOptions extends Vue {
        @Prop({ required: true }) readonly showOptions!: boolean;
        @Prop({ required: true }) readonly ctx!: Screens;
        storedOptions!: TScreenOptions;
        optionListValue(key: string, value: string, def: string) {
            return (this.keyStored(key) !== NO_VAL)
                ? this.keyStored(key) === value
                : def
            ;
        }
        optionRadioValue(key: string, value: string, def: string) {
            return (this.keyStored(key) !== NO_VAL)
                ? this.keyStored(key) === value
                : def === value
                ;
        }
        optionValue(key: string, def: string) {
            // console.log('ovk', key);
            return (this.keyStored(key) !== NO_VAL) ? this.keyStored(key) : def;
        }
        setSelectOption(key: string, e: Event) {
            const t = (e.target as HTMLInputElement).value;
            this.setOption(key, t);
        }
        setRadioOption(key: string, e: Event) {
            const t: string = (e.target as HTMLInputElement).value;
            this.setOption(key, t);
        }
        setBoolOption(key: string, e: Event) {
            const t: boolean = (e.target as HTMLInputElement).checked;
            this.setOption(key, t);
        }
        setTextOption(key: string, e: Event) {
            const t: string = (e.target as HTMLInputElement).value;
            this.setOption(key, t);
        }
        setOption(key: string, t: string | boolean) {
            // const t = (e.target as HTMLInputElement).checked;
            // console.log('change', key, t);

            const stored = this.storedOptions; // all
            // console.log(stored);

            const newKeys = { [this.ctx]: {
                ...this.allStored(),
                [key]: t.valueOf()
            }};

            const data = { ...stored, ...newKeys };
            this.$store.commit('SET_SCREEN_OPTIONS', data);

            // console.log('s->', JSON.stringify(this.storedOptions));
            EventBus.emit(Events.UploadOptions);
        }
        load() {
            console.log('Load options for', this.ctx);
        }
        keyStored(key: string) {
            return (typeof this.allStored()[key] !== 'undefined') ? this.allStored()[key] : NO_VAL;
        }
        allStored() {
            return this.storedOptions[this.ctx] || {};
        }
        allOptions(): { [key: string]: any } {
            return ScreenOptions[this.ctx] || [];
        }
    }
</script>

<style scoped>
    .options-item {
        border-bottom: 1px solid white;
    }
    .options-root {
        position: relative;
    }
    .options-content {
        position: absolute;
        width: calc(100% - 6px * 2);
        height: min-content;
        background-color: #902121;

        border: 4px double white;
        padding: 2px;
    }
</style>
