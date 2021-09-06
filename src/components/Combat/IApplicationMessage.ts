import {IMessage} from "../../interfaces/IMessage";
import {ICombatType} from "./ICombatType";

// sendApp
// team0=331:721:706
// &type=buhurt - stype
// &nomination=
// &teamlimit=3
// &comment=&
// stime=1
// &money=undefined
// &class=frendlycombats


export interface ApplicationMessage extends IMessage {
    team0: string; //IFighter[],
    type: ICombatType;
    nomination: string;
    teamlimit: number;
    comment: string;
    stime: number;
    money: number;
    class: string;
}
