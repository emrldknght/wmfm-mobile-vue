import {IItem} from "../../interfaces/IItem";
import {OwnedItem} from "./getOwnedItems";

export const getWeaponCode = (item: OwnedItem | IItem): string => {
    return (item.type) ? item.type.charAt(0) : '';
};

export function getCategoryCode(items: IItem[]): string {
    let W = '';
    let S = '';
    items.forEach(item =>{
        if(item.class === 'weapon') {
            W = getWeaponCode(item); // item.type) ? item.type.charAt(0) : '';
        }
        if(item.class === 'shield') {
            S = 'sh';
        }
    });
    return `${W}_${S}`;
}
