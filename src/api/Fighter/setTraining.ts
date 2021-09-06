import {apiMessage} from "../../lib/AjaxApi";
import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";

export function setTraining(id: number, training: string): Promise<ServerQ> {
    const msg: IMessage = {id, training};
    return apiMessage(msg);
}
