// fetch(`http://wmfm.ru/a.php?&feature=mobile&PHPSESSID=${session}&${Actions.Fighters}=${id}`, {

import {IMessage} from "../interfaces/IMessage"
import {ServerActions} from "./ServerActions";
import {appendParams, prepareURL} from "./AjaxApi/functions";
import ConsoleW from "./ConsoleW";
import {IChatMessage} from "../components/Chat/IChatMessage";
import {IChampMsg} from "../components/Championship/IChampMsg";
import {request} from "./AjaxApi/request";

export function apiMessageChat(data: IMessage, trace = false): Promise<{ [key: string]: IChatMessage } | { result: boolean }> {
    if(trace) ConsoleW.log('api chat message with data ' + JSON.stringify(data));
    // eslint-disable-next-line prefer-const
    let { url, usp } = prepareURL(data, 'chat');

    usp = appendParams(usp, data);

    url.search = usp.toString();
    return request(url);
}

export function apiMessageCombat(data: IMessage): Promise<string> { // Promise<ICombatEvent[]>
    ConsoleW.log('api combat message with data ' + JSON.stringify(data));
    // eslint-disable-next-line prefer-const
    let { url, usp } = prepareURL(data, 'combat');

    usp = appendParams(usp, data);

    url.search = usp.toString();
    return request(url, true);
}

export function apiIndex(): Promise<{ [key: string]: IChatMessage } | { result: boolean }> {
    const { url } = prepareURL({}, 'index');
    return request(url, true);
}

export function apiMessageHtml(data: IChampMsg): Promise<string> {
    ConsoleW.log('api champ message with data ' + JSON.stringify(data));
    // eslint-disable-next-line prefer-const
    let { url, usp } = prepareURL(data, 'champ');

    usp = appendParams(usp, data);

    url.search = usp.toString();
    return request(url, true);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiMessage(data: IMessage, trace = false): any {
    if(trace) ConsoleW.log('api message with data ' + JSON.stringify(data));

    const { url, usp } = prepareURL(data);

    // Object.keys(data).forEach((item) => usp.append(item, data[item]));

    let key: keyof IMessage;
    for(key in data) {
        if(Object.prototype.hasOwnProperty.call(data, key)) {
        // if(data.hasOwnProperty(key)) {
            usp.append(key, (data[key] as string));
        }
    }

    url.search = usp.toString();
    // console.log('send:', url.toString());
    return request(url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiRequest(action: ServerActions, id: number | string = '', trace = false): any {
    if (trace) ConsoleW.log('api request ' + action);

    const { url, usp } = prepareURL(action);
    usp.append(action, id.toString());
    url.search = usp.toString();

    // console.log('send:', url.toString());
    return request(url);
}

// export const getClubMembers = apiRequest(ServerActions.ClubMembers);
// export const getUserInfo = apiRequest(ServerActions.User);
