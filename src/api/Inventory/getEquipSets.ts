import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";
import {IEquipSets} from "../../components/FighterInfo/IEquipSets";

export function getEquipSets(): IEquipSets {
    const msg: IMessage = { [ServerActions.EquipSets] : '' };
    return apiMessage(msg);
}
