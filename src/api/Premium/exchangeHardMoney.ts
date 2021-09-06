import {apiMessage} from "../../lib/AjaxApi";
import {IMessage} from "../../interfaces/IMessage";
import {ServerQ} from "../ServerQ.type";

export function exchangeHardMoney(exchange: number): Promise<ServerQ> {// async
    const msg = { exchange };
    return apiMessage(msg as IMessage);
}
