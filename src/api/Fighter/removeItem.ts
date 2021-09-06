import {IMessage} from "../../interfaces/IMessage";
import {apiMessage} from "../../lib/AjaxApi";
import {ServerQ} from "../ServerQ.type";

export function removeItem(itemId: number, fighterId: number): Promise<ServerQ> {
    const msg: IMessage = {"dress": itemId, "who": fighterId, "off": "off"};
    return apiMessage(msg);
}
