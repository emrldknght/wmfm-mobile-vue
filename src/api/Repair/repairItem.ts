import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";
import {RepairMode} from "../../interfaces/RepairMode";
import {ServerQ} from "../ServerQ.type";

export function repairItem(id: number, mode: RepairMode): Promise<ServerQ> {
    const msg: IMessage = {
        [ServerActions.RepairItem]: id,
        method: mode
    };
    return apiMessage(msg);
}
