<template>
    <div class="training-progress-wrapper">
        {{l('Training')}}: <DebugWrapper>{{ current }}</DebugWrapper>
        <DebugWrapper>
            [{{ fighter }}]
            <button @click="getTraining()">⟲️</button>
        </DebugWrapper>
        <template v-if="current">
            <div id="progress" style="">
                <div style="position:absolute; font-size: smaller">{{ progress }} %</div>
                <progress id="train" max="100" :value="progress"> {{progress}}%</progress>
            </div>
        </template>
        <template v-else>
            <div>&nbsp;</div>
        </template>
        <label>
            <select id="training" name="training"
                    @change="setTraining" :value="current"
                    ref="currentTraining"
            >
                <template v-for="item in trainingList">
                    <option :id="item.id" :value="item.value" :disabled="item.disabled">{{l(item.id)}}</option>
                </template>
            </select>
        </label>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import {locale} from "../../Locale";
    import {Watch} from "vue-property-decorator";
    import DebugWrapper from "../../DebugWrapper.vue";
    import {Training} from "./Training";
    import {getTrainingProgress} from "../../api/Fighter/getTrainingProgress";
    import {setTraining} from "../../api/Fighter/setTraining";

    @Component({
        components: {DebugWrapper},
        props: {
            // fighter: Number,
            // current: String,
        },
        computed: {
            fighter() { return this.$store.getters.SELECTED_FIGHTER; },
            current() { return this.$store.getters.SELECTED_FIGHTER_DATA.training; },
        }
    })
    export default class FighterTraining extends Vue {
        trainingList = Training;
        progress: number = 0;

        fighter!: number;
        current!: string;

        @Watch('fighter')
        onFighterChanged() {
            // console.log('watch');
            this.getTraining();
        }

        getTraining() {
            /*
            const msg: IMessage = {[ServerActions.TrainingProgress]: this.current, id: this.fighter};
            apiMessage(msg)
             */
            getTrainingProgress(this.current,this.fighter)
                .then((r: string) => {
                    // console.log('training', r);
                    this.progress = Math.min(parseFloat(r), 100);
                })
        }

        setTraining() {
            const t = (<HTMLInputElement>this.$refs.currentTraining).value;
            // console.log('set training', t);
            const msg = {id: this.fighter, training: t};
            /*
            apiMessage(msg)
             */
            setTraining(this.fighter, t)
                .then((r: any) => {
                    // console.log(r);
                    if (r === 1) {
                        return new Promise((resolve) => {
                            // EventBus.emit(Events.ChangeTraining, msg);
                            this.$store.dispatch('CHANGE_TRAINING', msg)
                                .then(() => resolve());
                        })
                    }
                    return false;
                })
                .then(() => {
                    this.getTraining();
                })
        }

        l(textBit: string) {
            return locale(textBit)
        }

        mounted() {
            // console.log('ft mount')
            this.getTraining();
        }

        updated() {
            // console.log('ft update')
            // this.getTraining();
        }
    }
</script>

<style scoped>
    .training-progress-wrapper {
        display:inline-flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
    }
    #progress{
        position:relative;
        width:max-content;
        display:flex;
        color:black;
    }
</style>
