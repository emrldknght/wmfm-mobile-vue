import {EventBus} from "../../EventBus";
import {Events} from "../../Events";
import {IDialogMode} from "./IDialogMode";

export function showSimpleInfoDialog(text: string, pre: undefined | boolean = undefined): void {
    if(typeof pre !== "undefined") {
        EventBus.emit(Events.DialogSetPre, pre);
    }
    EventBus.emit(Events.DialogSetMode, IDialogMode.Info);
    EventBus.emit(Events.DialogSetText, text);
    EventBus.emit(Events.DialogShow);
}
