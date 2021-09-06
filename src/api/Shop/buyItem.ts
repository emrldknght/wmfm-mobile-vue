import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";
import {ServerQ} from "../ServerQ.type";

export function buyItem(id: number, forgery: number, amount: number): Promise<ServerQ> {// async
    const msg: IMessage = {
        [ServerActions.BuyItem]: id,
        master: forgery,
        amount,
    };
    return apiMessage(msg);
}
