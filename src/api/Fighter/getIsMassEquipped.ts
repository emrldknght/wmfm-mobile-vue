import {ServerActions} from "../../lib/ServerActions";
import {apiRequest} from "../../lib/AjaxApi";
import {IEquipState} from "../../components/FighterList/IEquipState";

export function getIsMassEquipped(ids: string): Promise<IEquipState> {
    return apiRequest(ServerActions.IsMassEquipped, ids);
}
