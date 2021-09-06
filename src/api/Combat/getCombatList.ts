import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";
import {Options} from "../../Options";
import {ICombat} from "../../components/Combat/ICombat";

export function getCombatList(): Promise<ICombat[]> {
    // return apiRequest(ServerActions.CombatList, 'current');
    return apiRequest(ServerActions.CombatList, Options.id)
}
