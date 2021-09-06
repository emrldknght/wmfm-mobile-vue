import {apiMessage, apiRequest} from "../lib/AjaxApi";
import {IMessage} from "../interfaces/IMessage";
import {IMessageChamp} from "../components/Championship/IMessageChamp";
import {ServerActions} from "../lib/ServerActions";

export function getMoney(): Promise<number> {// async
    return apiRequest(ServerActions.GetMoney);
}
export function getRoubles(): Promise<number> {// async
    return apiRequest(ServerActions.GetRoubles);
}


export function getUserInfo(): any {// async
    return apiRequest(ServerActions.User);
}

export function getLeague(nomination: string, num: string): Promise<any> {// async
    const msg = { getleague: nomination , num };
    return apiMessage(msg as IMessage);
}
export function getTimeToChamp(): Promise<any> { // async
    const msg: IMessageChamp = { TimeToChamp: '', Amount: 100 };
    return apiMessage(msg);
}
