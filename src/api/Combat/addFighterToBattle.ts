import {ServerQ} from "../ServerQ.type";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function addFighterToBattle(fighterId: number, battleId: number): Promise<ServerQ> { // async
    const msg: IMessage = {
        [ServerActions.CheckFighter]: fighterId,
        combat: battleId,
        act: 'add'
    };
    return apiMessage(msg);
}
