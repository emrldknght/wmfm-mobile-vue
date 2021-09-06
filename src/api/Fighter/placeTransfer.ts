import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function placeTransfer(id: number, cost: number): Promise<ServerQ> {
    const msg: IMessage = {[ServerActions.PlaceTransfer]: id, cost};
    // const msg: IMessage = { get: ServerActions.HireFighter, id };
    return apiMessage(msg);
}
