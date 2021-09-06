import {IClubInfo} from "../../components/Club/IClubInfo";
import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";

export function getClubInfo(id: number): Promise<IClubInfo> {
    return apiRequest(ServerActions.GetClub, id);
}
