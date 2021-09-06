import {IMessage} from "./IMessage";
import {ServerActions} from "../lib/ServerActions";

export interface IMessageUserData extends IMessage {
    [ServerActions.GetStoredData]?: number;
    [ServerActions.GetUserData]?: number;
    [ServerActions.CreateUsrData]?: number;
    Txt?: string;
    [ServerActions.GetAllUsers]?: 0;
    [ServerActions.GetData]?: number;
    [ServerActions.StoreData]?: number;
}