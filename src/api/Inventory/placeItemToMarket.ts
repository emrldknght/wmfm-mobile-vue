import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function placeItemToMarket(id: number, cost: number): Promise<ServerQ> {
    const msg: IMessage = {[ServerActions.SellItem]: id, cost};
    return apiMessage(msg)
}
