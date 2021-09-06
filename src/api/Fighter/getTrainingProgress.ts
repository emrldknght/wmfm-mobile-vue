import {IMessage} from "../../interfaces/IMessage";
import {ServerActions} from "../../lib/ServerActions";
import {apiMessage} from "../../lib/AjaxApi";

export function getTrainingProgress(currentTraining: string, id: number): Promise<string> {
    const msg: IMessage = {[ServerActions.TrainingProgress]: currentTraining, id };
    return apiMessage(msg);
}
