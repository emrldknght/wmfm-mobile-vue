import {State} from "./state";
import {IItem} from "../interfaces/IItem";
import {IScreen} from "../interfaces/IScreen";
import {ICombatEvent} from "../components/Combat/ICombatEvent";
import {TScreenOptions} from "../components/AppScreenOptions/ScreenOptions";
import {IEquipState} from "../components/FighterList/IEquipState";

export const getters = {
    SCREENS: (state: State): IScreen => {
        return state.screens;
    },
    SCREEN_OPTIONS: (state: State): TScreenOptions => {
        return state.screenOptions;
    },
    MONEY: (state: State): number => {
        return state.vault.money;
    },
    ROUBLES: (state: State): number => {
        return state.vault.roubles;
    },
    FIGHTERS: (state: State): IFighter[] => {
        return state.fighters
    },
    SELECTED_FIGHTER: (state: State): number => {
        return state.selectedFighterId;
    },
    SELECTED_FIGHTER_DATA: (state: State): IFighter => {
        return state.selectedFighterData;
    },
    SELECTED_FIGHTER_INVENTORY: (state: State): IItem[] => {
        return state.selectedFighterInventory;
    },
    STORAGE_ITEMS: (state: State): IItem[] => {
        return state.storageItems;
    },
    EQUIP_STATE_ALL: (state: State): IEquipState => {
        return state.fightersEquipState;
    },
    BROKEN_ITEMS: (state: State): IItem[] => {
        // return state.storageItems.filter(item => parseIntE(item.durability, 0) < parseIntE(item.maxdurability, 0));
        return state.brokenItems;
    },
    SELECTED_ITEM: (state: State): number => { return state.selectedItemId; },
    COMBAT_ID: (state: State): number => { return state.showCombatId },
    COMBAT_INFO: (state: State): ICombatEvent[] => { return state.showCombatInfo },
    FIGHTER_CATEGORIES: (state: State): { [key: number]: string } => { return state.fighterCategories },
    FIGHTER_TEAMS: (state: State): Teams => { return state.teams },
};
