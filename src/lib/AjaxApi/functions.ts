import {ServerActions} from "../ServerActions";
import {IMessage} from "../../interfaces/IMessage";
import {chatPath, combatPath, htmlPath, indexPath, serverPath} from "./const";
import ConsoleW from "../ConsoleW";

function checkSession(action: ServerActions | IMessage): string {
    let session = localStorage.getItem('session');
    if(!session) {
        ConsoleW.error('API: Local session is empty:' + action);
        session = "not-avail";
    }
    return session;
}

function dec2bin(dec: number): string{
    return (dec >>> 0).toString(2);
}
function toBool(num: string): number {
    return parseInt(num);
}

function appendRequiredParams(data: ServerActions | IMessage, usp: URLSearchParams, options = 7): URLSearchParams {
    const session = checkSession(data);

    const flags = dec2bin(options);

    if(toBool(flags[0])) usp.append('feature', 'mobile');
    if(toBool(flags[1])) usp.append('debug', 'true');
    if(toBool(flags[2])) usp.append('PHPSESSID', session);

    return usp;
}

export function appendParams(usp: URLSearchParams, data: IMessage): URLSearchParams {
    let key: keyof IMessage;
    for(key in data) {
        if(Object.prototype.hasOwnProperty.call(data, key)) {
        // if(data.hasOwnProperty(key)) {
            usp.append(key, (data[key] as string));
        }
    }
    return usp;
}

type URLType = undefined | 'chat' | 'combat' | 'champ' | 'index';

type PreparedUrl = {url: URL; usp: URLSearchParams}

function _prepareURL(urlPath: string, data: ServerActions | IMessage): PreparedUrl {
    const url = new URL(urlPath);
    let usp = new URLSearchParams();
    usp = appendRequiredParams(data, usp);
    return { url, usp };
}

const __prepareIndexURL = (): PreparedUrl => _prepareURL(indexPath, {});
const __prepareMainURL = (data: ServerActions | IMessage): PreparedUrl => _prepareURL(serverPath, data);
const __prepareChatURL = (data: ServerActions | IMessage): PreparedUrl => _prepareURL(chatPath, data);
const __prepareCombatURL = (data: ServerActions | IMessage): PreparedUrl => _prepareURL(combatPath, data);
const __prepareHtmlURL = (data: ServerActions | IMessage): PreparedUrl => _prepareURL(htmlPath, data);

export function prepareURL(data: ServerActions | IMessage, type?: URLType): PreparedUrl {
    switch (type) {
        case 'index':
            return __prepareIndexURL();
        case 'combat':
            return __prepareCombatURL(data);
        case 'chat':
            return __prepareChatURL(data);
        case 'champ':
            return __prepareHtmlURL(data);
        default:
            return __prepareMainURL(data);
    }
}
