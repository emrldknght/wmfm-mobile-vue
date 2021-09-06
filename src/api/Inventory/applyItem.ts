import {IMessage} from "../../interfaces/IMessage";
import {apiMessage} from "../../lib/AjaxApi";
import {ServerQ} from "../ServerQ.type";

export function applyItem(itemId: number, fighterId: number): Promise<ServerQ> {// async
    const msg: IMessage = {"dress": itemId, "who": fighterId};
    return apiMessage(msg);
}
