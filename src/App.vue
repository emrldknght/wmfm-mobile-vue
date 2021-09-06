<template>
    <div class="app">
        <template v-if="!logged">
            <LoginScreen :processAuth="processAuth"></LoginScreen>
        </template>
        <template v-else>
            <Main :logOut="logOut"></Main>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Main from "./Main.vue";
    import LoginScreen from "./components/LoginScreen.vue";
    import {Options} from "./Options";
    import {EventBus} from "./EventBus";
    import {Events} from "./Events";
    import {Credentials, getCred, isCredEmpty} from "./interfaces/Credentials";
    import {parseIntE} from "./lib/parseIntE";
    import {IAnswer} from "./interfaces/IAnswer";
    import ConsoleW from "./lib/ConsoleW";
    import {auth} from "./lib/AjaxApi/auth";

    export default Vue.extend({
        name: 'App',
        data: function () {
            return {
                logged: false,
                name: 'Hello World!',
            }
        },
        methods: {
            logOut(): void {
                ConsoleW.log('log out');
                localStorage.removeItem('session');
                localStorage.removeItem('id');
                Options.id = -1;

                this.logged = false;
            },
            processAuth(session: string, data: IAnswer) {
                // console.log('process auth');
                localStorage.setItem('session', session);
                const id = parseIntE(data.id);
                localStorage.setItem('id', id.toString());
                Options.id = id;

                Options.playerInfo = data;

                // apiRequest(ServerActions.User, data.id).then(j => console.log('user', j));
                this.logged = true;
            },
            logIn() {
                const id = parseIntE(localStorage.getItem('id'), 0);
                if(id) {
                    this.logged = true;
                    Options.id = id;
                } else {
                    ConsoleW.error('no saved id!');
                }
            },
            checkAuth() {
                ConsoleW.log('checking auth...');
                const cred: Credentials = getCred();
                const { login, password } = cred;

                if(login && password) {
                    EventBus.emit(Events.Authorize);
                    return;
                }
                ConsoleW.log('re-login failed, no valid saved credentials');

                /*
                apiRequest(ServerActions.isAuthorized)
                    .then((result: { id: boolean | string }) => {

                        const id = result.id;
                        console.log( 'isAuth', id, typeof id);

                        if(id !== false) {
                            this.logIn();
                        } else {
                            console.log('session time-out, re-login');
                            const cred: Credentials = getCred();
                            const { login, password } = cred;

                            if(login && password) {
                                EventBus.emit(Events.Authorize);
                                return;
                            }

                            console.log('re-login failed, no valid save credentials');

                        }
                    })
                */

            },
            getConfig() {
                fetch('/config.json')
                    .then((res) => {
                        try {
                            return res.json();
                        } catch (e) {
                            throw new Error('invalid file');
                        }

                    })
                    .then((j: object) => {
                    // console.log('config', j);
                        Options.config = j;
                    }).catch(error => {
                        console.error('config file error:', error);
                    })
            }
        },
        mounted() {
            if (Options.DEBUG) {
                // Only runs in development and will be stripped from production build.
                ConsoleW.warn('RUNNING DEVELOPMENT BUILD!');
            }
            this.getConfig();

            this.checkAuth();
            EventBus.on(Events.RequestFailed, () => {
                const cred: Credentials = getCred();
                if(isCredEmpty(cred)) {
                    ConsoleW.error('cred empty, logout');
                    this.logOut();
                }
                auth(cred.login, cred.password).then((j: IAnswer) => {
                    if(j.error || !(j.PHPSESSID && j.id)) {
                        ConsoleW.error('re-login error, logout');
                        this.logOut();
                    } else {
                        localStorage.setItem('session', j.PHPSESSID);
                        localStorage.setItem('id', j.id);
                        document.location.reload();
                    }
                });
            })
        },
        components: {
            Main,
            LoginScreen
        }
    });
</script>

<style scoped>
    .app {
        width: 100%;
        height: 100%;
    }
    h1 {
        color: white;
        background-color: black;
    }

</style>
