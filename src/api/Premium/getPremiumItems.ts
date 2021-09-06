import {apiRequest} from "../../lib/AjaxApi";
import {ServerActions} from "../../lib/ServerActions";
import {IDonateItem} from "../../components/PremiumShop/IDonateItem";

export function getPremiumItems(): Promise<IDonateItem[]> {
    return apiRequest(ServerActions.PremiumShop)
}
