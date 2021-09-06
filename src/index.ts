import Vue from 'vue';
// ts-ignore
import App from './App.vue';
import {store} from "./store";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// import schemeDark from './color-scheme-dark.css';

new Vue({
    // scheme: schemeDark,
    el: '#app',
    store,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    render: h => h(App),
});
// Vue.prototype.scheme = schemeDark;
