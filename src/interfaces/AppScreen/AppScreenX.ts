import Vue from 'vue';
import {locale} from "../../Locale";
import {Screens} from "./Screens";
import {IScreen} from "../IScreen";
import {getX} from "./getX";
import Component from "vue-class-component";
// import {InterfaceState} from "../../lib/InterfaceState";

@Component({
    computed: {
        state(): IScreen {
            return this.$store.getters.SCREENS
        }
    }
})
export class AppScreenX extends Vue {
    // folded!: boolean; // = false;
    screenName: Screens = Screens.Default;
    state!: IScreen;
    // folded!:() => boolean | undefined;
    // folded: boolean | undefined;
    get folded(): boolean | undefined { return getX(this); }

    showOptions = false;
    toggleOptions(): void {
        console.log('self toggle options');
        this.showOptions = !this.showOptions;
    }
    /*
    getInterfaceState(ctx: this): void {
        // InterfaceState.getState(ctx);
    }
     */

    toggleFoldX(ctx: this): void {
        // this.folded = !this.folded;
        //InterfaceState.setState(this);
        this.$store.dispatch('SET_SCREEN_STATE', {name: ctx.screenName });
    }
    testSuper(): void {
        console.log('TEST SUPER@!');
    }
    l(textBit: string): string | Function {
        return locale(textBit);
    }
}
