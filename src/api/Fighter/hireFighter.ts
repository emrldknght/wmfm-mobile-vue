import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function hireFighter(id: number): Promise<ServerQ> {
    const msg: IMessage = {get: ServerActions.HireFighter, id};
    return apiMessage(msg);
}
