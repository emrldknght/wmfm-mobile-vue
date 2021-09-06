import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function getIsEquipped(id: number): Promise<boolean> {
    return apiRequest(ServerActions.IsEquipped, id)
}
