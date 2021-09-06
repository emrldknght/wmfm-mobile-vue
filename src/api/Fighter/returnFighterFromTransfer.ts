import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function returnFighterFromTransfer(id: number): Promise<ServerQ> {
    const msg: IMessage = {[ServerActions.PlaceTransfer]: id, cost: 'return'};
    return apiMessage(msg)
}
