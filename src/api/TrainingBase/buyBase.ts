import {ServerQ} from "../ServerQ.type";
import {apiMessage} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function buyBase(id: number): Promise<ServerQ> {// async
    return apiMessage({[ServerActions.BuyBase]: id});
}
