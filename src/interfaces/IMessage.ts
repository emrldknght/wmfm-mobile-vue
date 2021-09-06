import {ServerActions} from "../lib/ServerActions";
import {ShopItemTypes} from "../lib/ShopItemTypes";


export interface IMessage {
    [ServerActions.EquipSets]?: '';
    [ServerActions.BuyItemSet]?: number;
    [ServerActions.TrainingProgress]?: string;
    [ServerActions.MarketItems]?: number;
    [ServerActions.ShopItemSets]?: '';
    [ServerActions.ShopItems]?: number;
    [ServerActions.BuyItem]?: number;
    master?: number;
    amount?: number;
    [ServerActions.DropItem]?: number;
    [ServerActions.SellItem]?: number;
    cost?: number | 'return';
    [ServerActions.CancelSell]?: number;
    [ServerActions.RepairItem]?: number | 'all';
    method?: 'self' | 'master';
    [ServerActions.GetClubList]?: '';
    page?: number;
    limit?: number;
    // [propName: string]?: ServerActions,
    // [ServerActions]: ServerActions,
    action?: ServerActions;
    // item: keyof typeof IMessage,
    id? : number;
    dress?: number;
    who?: number;
    off?: 'off';
    training?: string;
    // limit?: number,
    get?: ServerActions | string;

    // Shop screen
    Limit?: number;
    Type?: ShopItemTypes;

    [ServerActions.Combat]?: number;
    last?: number;
    [ServerActions.CheckFighter]?: number;
    act?: 'add';
    // Messages
    messages?: 'get';
    messid?: string;
    [ServerActions.TransferFighters]?: number;
    [ServerActions.MakeTransfer]?: number;
    [ServerActions.PlaceTransfer]?: number;

    // chat
    name?: string;
    msg?: string;
    // base
    [ServerActions.BuyBase]?: number;
    [ServerActions.SetTicketPrice]?: number;
    [ServerActions.RecruitLockTime]?: number;
    [ServerActions.BuyBaseEquipment]?: string;
    [ServerActions.FreeFighters]?: '';
    Page?: number;
    Order?: string;

    // champ

}
