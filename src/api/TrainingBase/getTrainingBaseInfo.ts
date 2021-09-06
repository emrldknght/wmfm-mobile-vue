import {ITrainingBaseState} from "../../components/TrainingBase/ITrainingBaseState";
import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function getTrainingBaseInfo(): Promise<ITrainingBaseState> {
    return apiRequest(ServerActions.TrainingBaseInfo);
}
