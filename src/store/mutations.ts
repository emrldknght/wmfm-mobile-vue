import {State} from "./state";
import {findById} from "../lib/findById";
import {IItem} from "../interfaces/IItem";
import {ICombatEvent} from "../components/Combat/ICombatEvent";
import {IScreen} from "../interfaces/IScreen";
import {Screens} from "../interfaces/AppScreen/Screens";
import {InterfaceState} from "../lib/InterfaceState";
import {getOwnedItems} from "../components/FighterList/getOwnedItems";
import {getCategoryCode} from "../components/FighterList/getCategoryCode";
import {TScreenOptions} from "../components/AppScreenOptions/ScreenOptions";
import {IEquipState} from "../components/FighterList/IEquipState";

export const mutations = {
    SET_SCREENS: (state: State, payload: IScreen ): void => {
        state.screens = { ...state.screens, ...payload };
    },
    SET_SCREEN_OPTIONS: (state: State, payload: TScreenOptions): void => {
        state.screenOptions = payload;
    },
    SET_SCREEN_STATE: (state: State, payload: { name: Screens }): void => {
        // console.log('mutation: set screen state', JSON.stringify(payload));
        if (!state.screens[payload.name]) {
            // console.log('state is empty - init');
            state.screens[payload.name] = {folded: true};
        }
        // console.log('mutate', state.screens[payload.name].folded);
        state.screens[payload.name].folded = !state.screens[payload.name].folded;

        state.screens = { ...state.screens };
        InterfaceState.forceUpdate(state.screens);
        InterfaceState.save(); //FromVue(state.screens);
    },
    SET_MONEY: (state: State, payload: { money: number; roubles: number }): void => {
        state.vault.money = payload.money;
        state.vault.roubles = payload.roubles;
    },
    SET_FIGHTERS: (state: State, payload: IFighter[]): void => {
        state.fighters = payload;
    },
    CHANGE_FIGHTER_TRAINING: (state: State, payload: { id: number; training: string}): void => {
        const index = findById(state.fighters, payload.id);
        // console.log('-->', index);
        state.fighters[index].training = payload.training;
    },
    SELECT_FIGHTER_WITH_ID: (state: State, id: number): void => {
        state.selectedFighterId = id;
    },
    SET_SELECTED_FIGHTER_DATA: (state: State, data: IFighter): void => {
        state.selectedFighterData = data;
    },
    SET_SELECTED_FIGHTER_INVENTORY: (state: State, inventory: IItem[]): void => {
        state.selectedFighterInventory = inventory;
    },
    SET_STORAGE_ITEMS: (state: State, items: IItem[]): void => {
        state.storageItems = items;
    },
    SELECT_ITEM_WITH_ID: (state: State, id: number): void => {
        state.selectedItemId = id;
    },
    SET_ITEM_SELL_STATUS: (state: State, payload: { id: number; status: boolean }): void => {
        const index = findById(state.storageItems, payload.id);
        if(index !== -1) {
            state.storageItems[index].tosell = (payload.status) ? '1' : '0';
        }
    },
    SET_ITEM_DRESS_STATUS: (state: State, payload: { id: number; status: number }): void => {
        const index = findById(state.storageItems, payload.id);
        // console.log(index, 'dress status', payload);
        if(index !== -1) {
            // console.log(index, 'dress status', payload.status);
            state.storageItems[index].dressed = (payload.status).toString();
        }
    },
    SET_EQUIP_STATE_ALL: (state: State, payload: IEquipState): void => {
        state.fightersEquipState = payload;
    },
    SET_EQUIP_STATE: (state: State, payload: { id: number; status: boolean }): void => {
        state.fightersEquipState[payload.id] = payload.status;
    },
    SET_BROKEN_ITEMS: (state: State, list: IItem[]): void => {
        state.brokenItems = list;
    },
    SET_SHOW_COMBAT_ID: (state: State, id: number): void => {
        state.showCombatId = id;
    },
    SET_SHOW_COMBAT_INFO: (state: State, data: ICombatEvent[] ): void => {
        state.showCombatInfo = data;
    },
    SET_FIGHTER_CATEGORIES: (state: State): void => {
        // console.log('SET FC', state.storageItems.length);

        state.fighters.forEach(f => {
            const id: string = f.id || '-1';
            const items = getOwnedItems(state.storageItems, id);
            state.fighterCategories[id] = getCategoryCode(items);
        });

        // state.fighterCategories['40'] = 'test_cat';
        // console.log(JSON.stringify(state.fighterCategories));
    },
    ADD_FIGHTER_TO_TEAM: (state: State, payload: { teamNumber: number; id: number }): void => {
        const id = payload.id;
        if(state.teams[payload.teamNumber].ids.includes(id)) return;
        state.teams[payload.teamNumber].ids.push(payload.id);
    },
    REMOVE_FIGHTER_FROM_TEAM: (state: State, payload: { teamNumber: number; id: number }): void => {
        const teamNumber = payload.teamNumber;
        const id = payload.id;
        const index = state.teams[teamNumber].ids.indexOf(id);
        console.log(payload, index);
        if(index !== -1) {
            //state.teams[teamNumber] =
            state.teams[teamNumber].ids.splice(index, 1);
        }
    },
    SET_TEAM_NAME: (state: State, payload: {teamNumber: number; name: string }): void => {
        state.teams[payload.teamNumber].name = name;
    },
    CLEAR_TEAM: (state: State, teamNumber: number): void => {
        state.teams[teamNumber].ids = [];
    },
    LOAD_TEAMS: (state: State, data: Teams): void => {
        state.teams = data;
    }
};
