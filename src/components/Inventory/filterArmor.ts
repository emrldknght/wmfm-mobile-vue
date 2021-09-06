import {IItem} from "../../interfaces/IItem";
import {BodyPart} from "../../interfaces/BodyPart";

export function filterArmor(filter: boolean, item: IItem, partFilter: BodyPart): boolean {
    if (partFilter) {
        const bodyPart = item.bodypart || '';
        const parts = bodyPart.split(',');
        filter = filter && parts.some(e => e === partFilter);
    }
    return filter;
}