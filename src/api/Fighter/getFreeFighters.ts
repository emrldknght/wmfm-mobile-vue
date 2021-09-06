import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";
import {SortType} from "../../lib/Recruit";

export function getFreeFighters(page: number, sort: SortType): Promise<{ [key: number]: IFighter; page: number; pages: number }> {// async
    const msg: IMessage = {
        [ServerActions.FreeFighters]: '',
        Page: page,
        Order: sort
    };
    // apiRequest(ServerActions.FreeFighters)
    return apiMessage(msg);
}
