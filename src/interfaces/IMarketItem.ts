import {IItem} from "./IItem";

export interface IMarketItem extends IItem{
    sellcost: string;
    time: string;
    oid: string;
    username: string;
    club: string;
}
