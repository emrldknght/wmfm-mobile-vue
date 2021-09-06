import {IShopItem} from "../../interfaces/IShopItem";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {ShopItemTypes} from "../../lib/ShopItemTypes";
import {apiMessage} from "../../lib/AjaxApi";

export function getShopItems(): Promise<IShopItem[]> {
    const message: IMessage = {
        [ServerActions.ShopItems]: 1,
        Limit: 1000,
        Type: ShopItemTypes.All
    };
    return apiMessage(message);
}
