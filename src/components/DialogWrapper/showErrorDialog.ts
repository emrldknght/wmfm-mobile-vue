import {EventBus} from "../../EventBus";
import {Events} from "../../Events";
import {IDialogMode} from "./IDialogMode";

export function showErrorInfoDialog(errorText: string): void {
    EventBus.emit(Events.DialogSetMode, IDialogMode.Error);
    EventBus.emit(Events.DialogSetText, errorText);
    EventBus.emit(Events.DialogShow);
}
