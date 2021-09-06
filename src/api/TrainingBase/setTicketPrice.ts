import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function setTicketPrice(price: number): Promise<ServerQ> {
    const msg: IMessage = {[ServerActions.SetTicketPrice]: price};
    return apiMessage(msg);
}
