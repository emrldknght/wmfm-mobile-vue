import {IPlayerInfo} from "./IPlayerInfo";

export interface IAnswer extends IPlayerInfo{
    error?: string;
    PHPSESSID?: string;
    // id?: string
}
