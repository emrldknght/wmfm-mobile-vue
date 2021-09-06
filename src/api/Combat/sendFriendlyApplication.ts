import {apiMessage} from "../../lib/AjaxApi";
import {ApplicationMessage} from "../../components/Combat/IApplicationMessage";
import {ServerQ} from "../ServerQ.type";

export function sendFriendlyApplication(msg: ApplicationMessage): Promise<ServerQ> {
    // TODO: refactor incoming message
    return apiMessage(msg)
}
