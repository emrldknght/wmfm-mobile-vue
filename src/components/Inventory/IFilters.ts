import {IItem} from "../../interfaces/IItem";
import {ItemTypes} from "../../interfaces/ItemTypes";

export interface IFilters {
    applyFilter(item: IItem): boolean;
    itemTypeFilter: ItemTypes;
}