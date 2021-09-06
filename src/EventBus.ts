import Vue from 'vue';
import {Events} from "./Events";
import ConsoleW from "./lib/ConsoleW";
// import {Events} from "./Events";

class EBus extends Vue {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event: Events, data?: any): void {
        ConsoleW.log('Event emitted:', event);
        this.$emit(event, data)
    }
    on(event: Events, callback: Function): void {
        // console.log('Event on:', event);
        this.$on(event, callback);
    }
}

// export const EventBus = new Vue();
export const EventBus = new EBus();
