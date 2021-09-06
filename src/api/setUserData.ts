import {IMessageUserData} from "../interfaces/IMessageUserData";
import {ServerActions} from "../lib/ServerActions";
import {Options} from "../Options";
import {apiMessage} from "../lib/AjaxApi";

export function setUserData(data: object | string): void {
    const msg: IMessageUserData = {[ServerActions.StoreData]: Options.id, Txt: JSON.stringify(data)};
    apiMessage(msg).then(() => console.log('user data set'));
}
