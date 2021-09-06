import {IScreen, IScreenKey} from "../interfaces/IScreen";
import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
import {Screens} from "../interfaces/AppScreen/Screens";

export class InterfaceState {
    public static state: IScreen = {};

    public static forceUpdate(state: IScreen): void {
        this.state = state;
    }

    public static load(): void {
        // console.log('load interface state from saved');
        const savedState = localStorage.getItem('interface');

        if(!savedState) {
            this.save();
        } else {
            this.state = {...this.state, ...JSON.parse(savedState)};
        }
        // console.log(this.state);
    }
    public static save(): void {
        // console.log('i save', JSON.stringify(this.state), this.state);
        const interfaceState = JSON.stringify(this.state);
        localStorage.setItem('interface', interfaceState)
    }
    /*
    public getState(ctx: AppScreenX): void {
        if(!ctx.screenName && Options._DEBUG_ON) {
            ConsoleW.warn('screenName is not defined for ' + ctx.constructor.name);
        }
        // this.getFold(ctx);
    }

     */

    private static getScreenId(ctx: AppScreenX): string | Screens {
        return ctx.screenName || ctx.constructor.name;
    }


    // static getFold(ctx: AppScreenX) {
        /*
        const screenName = this.getScreenId(ctx);

        // override AppScreen in file
        const optFolded = ctx.folded;

        const defaultFold = new AppScreenX().folded && optFolded;
        const screenState = this.state[screenName]?.folded;


        if(ctx.folded) {
            if(typeof screenState === 'boolean') {
                // console.log(`set ${screenName} state from saved to ${screenState}`);
                ctx.folded = screenState;
            } else {
                ctx.folded = defaultFold;
            }
        }
         */
    // }
    /*
    static setState(ctx: AppScreenX, key = 'fold', value = ''): void {
        if(key === 'fold') {
            this.setFold(ctx);
        } else {
            this.setStateKey(ctx, key, value);
        }
    }
     */
    public static setStateKey(ctx: AppScreenX, key: string , value: string): void {
        console.log('ssk');
        // used in base
        const screenName = this.getScreenId(ctx);
        if(!this.state[screenName]) this.state[screenName] = {};
        this.state[screenName][key] = value;
    }
    public static getStateKey(ctx: AppScreenX, key: string): IScreenKey | undefined{
        const screenName = this.getScreenId(ctx);

        if(this.state[screenName]) {
            if(this.state[screenName][key]) {
                return this.state[screenName][key];
            }
        }

        return undefined;
    }
    public static setFold(ctx: AppScreenX): void {
        console.log('set fold');
        const screenName = this.getScreenId(ctx);
        // console.log('set I', screenName, ctx.folded, this.state);

        if(!this.state[screenName]) this.state[screenName] = {};
        this.state[screenName].folded = ctx.folded;

        this.save();
    }
}
