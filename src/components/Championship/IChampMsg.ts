import {IMessage} from "../../interfaces/IMessage";

export interface IChampMsg extends IMessage {
    get?: string;
    nomination?: string;
    category?: string;
}
