import {ServerQ} from "../ServerQ.type";
import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function buyMarketItem(id: number): Promise<ServerQ> {// async
    return apiRequest(ServerActions.BuyMarket, id);
}
