import {IItem} from "../../interfaces/IItem";
import {parseIntE} from "../../lib/parseIntE";

export function brokePercent(item: IItem): number {
    const num = parseIntE(item.durability) / parseIntE(item.maxdurability);
    return Math.floor(num * 100); //.toFixed(2); // get2AfterP(num) * 100; //
}