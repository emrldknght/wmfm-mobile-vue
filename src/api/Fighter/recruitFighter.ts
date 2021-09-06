import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";
import {ServerQ} from "../ServerQ.type";

export function recruitFighter(id: number): Promise<ServerQ> {
    const msg = { get: ServerActions.RecruitFighter, id };
    return apiMessage(msg);
}
