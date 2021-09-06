import {IMarketItem} from "../../interfaces/IMarketItem";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function getMarketItems(): Promise<IMarketItem[]> {
    const msg: IMessage = {[ServerActions.MarketItems]: 1, Limit: 1000};
    return apiMessage(msg);
}
