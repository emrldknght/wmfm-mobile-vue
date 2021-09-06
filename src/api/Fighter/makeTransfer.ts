import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function makeTransfer(id: number): Promise<ServerQ> {
    const msg: IMessage = {[ServerActions.MakeTransfer]: id};
    return apiMessage(msg)
}
