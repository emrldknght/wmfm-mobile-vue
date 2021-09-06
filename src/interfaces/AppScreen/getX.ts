import {AppScreenX} from "./AppScreenX";

export function getX(ctx: AppScreenX): boolean | undefined {
    // console.log('calc for', ctx.screenName);
    if(!ctx.state) {
        console.error('no getters!');
        return true;
    }
    if(!ctx.state[ctx.screenName]) {
        // console.warn('no state!');
        return true;
    }
    return ctx.state[ctx.screenName].folded;
}