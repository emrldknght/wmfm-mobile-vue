import {IItem} from "../../interfaces/IItem";
import {WeaponTypes} from "../../interfaces/WeaponTypes";

export function filterWeapon(filter: boolean, item: IItem, typeFilter: WeaponTypes): boolean {
    if (typeFilter) {
        filter = item.type === typeFilter;
    }
    return filter;
}