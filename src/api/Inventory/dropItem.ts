import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";
import {ServerQ} from "../ServerQ.type";

export function dropItem(id: number): Promise<ServerQ> {// async
    const msg: IMessage = { [ServerActions.DropItem]: id };
    // console.log('will send', msg);
    return apiMessage(msg)
}
