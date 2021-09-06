import {apiMessage} from "../../lib/AjaxApi";
import {IMessage} from "../../interfaces/IMessage";
import {ServerQ} from "../ServerQ.type";

export function buyPremiumItem(id: number): Promise<ServerQ> {// async
    const msg = { buydonate: id };
    return apiMessage(msg as IMessage)
}
