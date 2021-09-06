export type IScreenKey = string | boolean | undefined;

export interface IScreen {
    [screen: string]: {
        folded?: boolean | undefined;
        [key: string]: IScreenKey;
    };
}