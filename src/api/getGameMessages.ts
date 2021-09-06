import {IStatusMessage} from "../components/Messages/IStatusMessage";
import {IMessage} from "../interfaces/IMessage";
import {apiMessage} from "../lib/AjaxApi";

export function getGameMessages(): Promise<{ [id: string]: IStatusMessage }> {
    const msg: IMessage = {
        messages: 'get',
        // messid: ''
    };
    return apiMessage(msg, true);
}
