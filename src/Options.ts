import {IPlayerInfo} from "./interfaces/IPlayerInfo";

type Config = {
    allowDebugDummy?: number[];
}

export class Options {
    public static _DEBUG_ON = false;

    public static MOCK = false;

    // do not change!
    public static DEBUG = process.env.NODE_ENV === 'development' && Options._DEBUG_ON;

    public static id = -1;
    public static playerInfo: IPlayerInfo = {};
    public static serverPath: string = (Options.MOCK)? 'http://localhost:8000/' : 'http://wmfm.ru/';

    public static config: Config = {
        allowDebugDummy: [],
    };

    static allowDummy(): boolean {
        // console.log(Options.config.allowDebugDummy, Options.id);
        return (Options.config.allowDebugDummy) ? Options.config.allowDebugDummy.includes(Options.id) : false;
    }
}
