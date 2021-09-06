import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";
import {Options} from "../../Options";

export async function getClubMembers(): Promise<IFighter[]> {
    return await apiRequest(ServerActions.ClubMembers, Options.id);
}
