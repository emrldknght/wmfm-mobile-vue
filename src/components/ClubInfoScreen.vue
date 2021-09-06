<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('clubInfo')" :ctx="this"></AppScreenHeader>
            <ListWrapper>
                <div class="ci-body">
                    <ClubInfo :data="data" :k="0" vertical></ClubInfo>
                    <span>
                        <button @click="showSummary()">{{l('review')}}</button>
                    </span>
                    <span>
                        {{l('awards')}}
                    </span>
                    <span>
                        {{l('achievements')}}
                    </span>
                    <span>
                        {{l('stats')}}
                    </span>
                </div>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {IClubInfo} from "./Club/IClubInfo";
    import ClubInfo from "./Club/ClubInfo.vue";
    import {Options} from "../Options";
    import ListWrapper from "./ListWrapper.vue";
    // import TButton from "./ToggleScreenButtons/TButton.vue";
    import DebugWrapper from "../DebugWrapper.vue";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {IScreen} from "../interfaces/IScreen";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {getClubInfo} from "../api/Club/getClubInfo";
    import DebugStoredData from "./DebugStoredData.vue";

    @Component({
        components: {DebugStoredData, AppScreenHeader, DebugWrapper, ListWrapper, ClubInfo},
        computed: {
            state() {
                return this.$store.getters.SCREENS
            }
        }
    })
    export default class ClubInfoScreen extends AppScreenX {
        state!: IScreen;
        screenName = Screens.ClubInfo;
        id: number = Options.id;

        data: IClubInfo | {} = {};
        toggleFold() {
            if(this.folded) {
                this.getInfo();
            }
            this.toggleFoldX(this);
        }
        getInfo() {
            getClubInfo(this.id).then((result: IClubInfo) => {
                // console.log('ci', result);
                this.data = result;
            });
        }

        showSummary() {
            EventBus.emit(Events.FightersSummaryScreenToggle);
        }

        mounted() {
            if(!this.folded) {
                this.getInfo();
            }
            EventBus.on(Events.ClubInfoScreenToggle, () => this.toggleFold())
        }
    }
</script>

<style scoped>
    .ci-body {
        display:flex;
        flex-direction:column;
    }
    .screen-wrapper {
        background-color: var(--main-bg-color);
        color:white;
        max-width: 35vw;

        display: flex;
        flex-direction: column;
    }
</style>
