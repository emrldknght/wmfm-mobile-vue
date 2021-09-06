import {ICurrentBase} from "./ICurrentBase";
import {BaseStateKey} from "./BaseStateKey.type";

export interface ITrainingBaseState {
    [key: string]: BaseStateKey;

    currentwatchers: number;
    currentbase: ICurrentBase | undefined;
}
