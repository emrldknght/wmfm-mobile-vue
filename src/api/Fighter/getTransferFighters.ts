import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function getTransferFighters(): Promise<IFighter[]> {
    const msg: IMessage = {[ServerActions.TransferFighters]: 1};
    return apiMessage(msg);
}
