import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function getFriendlyCombatList(): Promise<ICombatFriendly[]> {
    return apiRequest(ServerActions.FriendlyCombatList, 0)
}
