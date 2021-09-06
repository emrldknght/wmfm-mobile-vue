import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function buyBaseEquipment(name: string): Promise<ServerQ> {// async
    const msg: IMessage = {[ServerActions.BuyBaseEquipment]: name};
    return apiMessage(msg);
}
