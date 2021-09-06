import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function returnItemFromMarket(id: number): Promise<ServerQ> {
    const msg: IMessage = {[ServerActions.CancelSell]: id};
    return apiMessage(msg);
}
