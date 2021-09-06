import {IClubInfoList} from "../../components/Club/IClubInfoList";
import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function getClubList(page: number, limit: number): Promise<IClubInfoList> {
    const msg: IMessage = {
        [ServerActions.GetClubList]: '',
        // page: 1,
        page,
        limit
    };
    return apiMessage(msg); //:
}
