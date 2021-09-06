import {AppScreenX} from "./interfaces/AppScreen/AppScreenX";

type Interval = number | undefined;
const second = 1000;

type Updater = { ctx: AppScreenX ; cb: Function }

export class GlobalTimers {
    private static interval: Interval = undefined;
    private static updateTime = 5 * second;

    private static updateRunning = false;

    static updaters: Updater[] = [];
    static add(ctx: AppScreenX, cb: Function): void {
        this.updaters.push({ ctx, cb });
    }

    private static processUpdate(): void {
        // console.log(this.updaters);
        this.updaters.forEach((e: Updater) => {
            if(!e.ctx.folded) e.cb();
        })
    }

    private static updateTimers(): void {
        // console.log('call update');
        if(!this.updateRunning) {
            this.updateRunning = true;
            // console.log('update timers');
            this.processUpdate();
            window.setTimeout(() => this.updateRunning = false, 300);
        }
    }
    static start(): void {
        console.log('start global timers');
        if(!this.interval) {
            this.interval = window.setInterval(() => this.updateTimers(), this.updateTime);
        }
    }
    static stop(): void {
        clearInterval(this.interval);
    }
}
