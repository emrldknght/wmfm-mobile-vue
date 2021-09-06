import {EventBus} from "../../EventBus";
import {Events} from "../../Events";
import {showErrorInfoDialog} from "../DialogWrapper/showErrorDialog";
import {IItem} from "../../interfaces/IItem";

export function processPurchase(apiRes: 1 | { result: string }, item: IItem): boolean {
    // console.log('processPurchase', apiRes);
    if(apiRes === 1) {
        EventBus.emit(Events.AddItem, item);
        EventBus.emit(Events.RefreshMoney);
        return true;
    } else {
        showErrorInfoDialog(apiRes.result);
        return false;
    }
}