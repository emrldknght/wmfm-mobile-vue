import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function getRecruitLockTime(): Promise<{ recruittime: number }> {
    const msg: IMessage = { [ServerActions.RecruitLockTime]: 0 };
    return apiMessage(msg);
}
