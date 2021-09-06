import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function getFighterData(id: number): Promise<IFighter> {
    return apiRequest(ServerActions.Fighter, id);
}
