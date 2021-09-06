import Vue from "vue";
import {locale} from "../Locale";
import {IScreen} from "./IScreen";
import {Screens} from "./AppScreen/Screens";

/*
@Component({
    computed: {
        state() {
            return this.$store.getters.SCREENS;
        }
    }
})
 */
export class AppScreen extends Vue {
    // [propName: string]: any;
    state!: IScreen;
    folded = true;
    // folded!: boolean;
    screenName: Screens = Screens.Default;

    toggleFold(): void {
        this.folded = !this.folded;
        // InterfaceState.setState(this);
        // this.$store.dispatch('SET_SCREEN_STATE', {name: ctx.screenName });
    }

    screenState(ctx: this): IScreen {
        return this.$store.getters.SCREENS[ctx.screenName];
    }

    getInterfaceState(ctx: this): void {
        console.log('current state:', ctx);
        // InterfaceState.getState(ctx);
    }

    l(textBit: string): string | Function {
        return locale(textBit);
    }
    mounted(): void {
        // ConsoleW.warn('App-Screen Mounted');

    }
}
