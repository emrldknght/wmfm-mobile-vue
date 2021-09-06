import {apiRequest} from "../lib/AjaxApi";
import {ServerActions} from "../lib/ServerActions";

export function getServerTime(): Promise<{ time: number }> {
    return apiRequest(ServerActions.GetServerTime);
}
