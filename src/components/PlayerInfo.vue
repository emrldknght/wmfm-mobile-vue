<template>
    <div class="player-info">
        <DebugWrapper>
            Player info:
            id [{{ playerId() }}]
            <button @click="refreshMR()">MR</button>
        </DebugWrapper>
        <span class="pi-r">₽{{roubles}}</span>
        <span class="pi-m">${{money}}</span>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import {Options} from "../Options";
    import DebugWrapper from "../DebugWrapper.vue";
    import {getUserInfo} from "../api/api";

    @Component({
        components: {DebugWrapper},
        computed: {
            money() { return this.$store.getters.MONEY },
            roubles() { return this.$store.getters.ROUBLES }
        }
    })
    export default class PlayerInfo extends Vue{
        name = "PlayerInfo";

        money!: number; // = 0;
        roubles!: number; // = 0;

        playerId() {
            return Options.id;
        }

        refreshMR() {
            this.$store.dispatch('GET_MONEY');
            /*
            apiRequest(ServerActions.GetMoney).then((res: number) => {
                // console.log('GM', res, typeof res);
                this.money = res;
            });
            apiRequest(ServerActions.GetRoubles).then((res: number) => {
                // console.log('GR', res, typeof res);
                this.roubles = res;
            });
             */
            //apiRequest(ServerActions.User)
            getUserInfo()
                .then((res: any) => {
                // console.log('user', res);
            });
        }

        mounted() {
            this.refreshMR();
            EventBus.on(Events.AddItem, ()=> this.refreshMR());
            EventBus.on(Events.RefreshMoney, () => this.refreshMR());
        }
    }
</script>

<style scoped>
    .player-info {
        display: flex;
        flex-direction: column;
        padding: 0 5px;
    }
    .pi-r {
        color: red;
    }
    .pi-m { color: gold }
</style>
