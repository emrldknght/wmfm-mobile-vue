import {apiMessage, apiMessageCombat, apiRequest} from "../lib/AjaxApi";
import {ServerActions} from "../lib/ServerActions";
import {Options} from "../Options";
import {findById} from "../lib/findById";
import {state} from "./state";
import {IMessage} from "../interfaces/IMessage";
import {IScreen} from "../interfaces/IScreen";
import {Screens} from "../interfaces/AppScreen/Screens";
import {getMoney, getRoubles} from "../api/api";
import {getClubMembers} from "../api/Club/getClubMembers";
import {getFighterData} from "../api/Fighter/getFighterData";
import {IMessageUserData} from "../interfaces/IMessageUserData";
import {parseIntE} from "../lib/parseIntE";
import {getIsMassEquipped} from "../api/Fighter/getIsMassEquipped";
import {IEquipState} from "../components/FighterList/IEquipState";
import {forceObject} from "../lib/AjaxApi/forceObject";
import {getIsEquipped} from "../api/Fighter/getIsEquipped";
// import {InterfaceState} from "../lib/InterfaceState";


interface Context {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commit: (arg0: string, arg1: any) => void;
    dispatch: (arg0: string) => void;
}

export const actions = {
    SET_INTERFACE: (context: Context, payload: IScreen): void => {
        context.commit('SET_SCREENS', payload);
    },
    SET_SCREEN_STATE: (context: Context, payload: { name: Screens }): void => {
        // console.log('action: set screen state', JSON.stringify(payload));
        context.commit('SET_SCREEN_STATE', payload);
        // InterfaceState.save(); //FromVue(state.screens);
    },
    GET_APP_OPTIONS: async (context: Context): Promise<void> => {
        const msg: IMessageUserData = {
            [ServerActions.GetData]: Options.id
        };

        type UData = { id: string; usr: string; txt: string };
        const answer: UData[] = await apiMessage(msg);
        let j: string = answer[0].txt;
        j = j.replace(/&quot;/gm, '"');
        console.log('a->', j);

        const data = JSON.parse(j);
        context.commit('SET_SCREEN_OPTIONS', data.screenOptions);

        if(data.teams) {
            context.commit('LOAD_TEAMS', data.teams);
        }
    },
    GET_MONEY: async (context: Context): Promise<void> => {
        // const m = await apiRequest(ServerActions.GetMoney) || 0;
        const m = await getMoney() || 0;
        // const r = await apiRequest(ServerActions.GetRoubles) || 0;
        const r = await getRoubles() || 0;
        context.commit('SET_MONEY', { money :m, roubles: r });
    },
    GET_FIGHTER_LIST: async (context: Context): Promise<void> => {
        // console.log('vuex action - get fighters');
        // const data = await apiRequest(ServerActions.ClubMembers, Options.id) || [];
        const data = await getClubMembers() || [];
        // console.log(data);
        context.commit('SET_FIGHTERS', data);
    },
    CHANGE_TRAINING: (context: Context , payload: {id: number; training: string}): void => {
        context.commit('CHANGE_FIGHTER_TRAINING', payload);
    },
    SELECT_FIGHTER: (context: Context, id: number): void => {
        context.commit('SELECT_FIGHTER_WITH_ID', id);
    },
    GET_SELECTED_FIGHTER_DATA: async (context: Context): Promise<void> => {
        const id = state.selectedFighterId;
        // console.log('gsfd', id);
        let data = {};

        if(id !== -1) {
            const index = findById(state.fighters, id);
            data = (index !== -1)
                ? state.fighters[index]
                // : await apiRequest(ServerActions.Fighter, id);
                : await getFighterData(id);
        }

        context.commit('SET_SELECTED_FIGHTER_DATA', data);
    },
    GET_SELECTED_FIGHTER_INVENTORY: async (context: Context): Promise<void> => {
        const id = state.selectedFighterId;
        const inventory = (id!== -1)
            ? await apiRequest(ServerActions.FighterInventory, id) || []
            : [];

        context.commit('SET_SELECTED_FIGHTER_INVENTORY', inventory);
    },
    GET_STORAGE_ITEMS: async (context: Context): Promise<void> => {
        const data = await apiRequest(ServerActions.Inventory, Options.id) || [];
        context.commit('SET_STORAGE_ITEMS', data);
    },
    GET_FIGHTER_CATEGORIES: (context: Context): void => {
        // if (state.storageItems.length === 0) return;
        // console.log('GET FC');
        context.commit('SET_FIGHTER_CATEGORIES', 0);
    },
    SELECT_ITEM: (context: Context, id: number): void => {
        context.commit('SELECT_ITEM_WITH_ID', id);
    },
    SET_ITEM_SELL_STATUS_A: (context: Context, payload: { id: number; status: boolean }): void => {
        context.commit('SET_ITEM_SELL_STATUS', payload);
    },
    SET_ITEM_DRESS_STATUS_A: (context: Context, payload: { id: number; status: number }): void => {
        // console.log('dress->', payload);
        context.commit('SET_ITEM_DRESS_STATUS', payload);
    },
    GET_BROKEN_ITEMS: async (context: Context): Promise<void> => {
        const data = await apiRequest(ServerActions.BrokenItems) || [];
        context.commit('SET_BROKEN_ITEMS', data);
    },
    GET_EQUIP_STATE_ALL: async (context: Context): Promise<void> => {
        const list = state.fighters;

        if(list.length === 0) return;
        const ids: number[] = [];
        list.forEach((item: IFighter) => ids.push(parseIntE(item.id)));

        // console.log('check equipment', ids);

        let res: IEquipState = await getIsMassEquipped(JSON.stringify(ids)) || {};
        res = forceObject(res);

        context.commit('SET_EQUIP_STATE_ALL', res);

    },
    GET_EQUIP_STATE: async (context: Context, id: number): Promise<void> => {
        const status: boolean = await getIsEquipped(id) || false;
        context.commit('SET_EQUIP_STATE', { id, status });
    },
    SET_CID: async (context: Context, id: number): Promise<void> => {
        const current = state.showCombatId;
        if(id !== current) {
            context.commit('SET_SHOW_COMBAT_ID', id);

            const msg: IMessage = { combat: id, last: 0 };
            let data: string = await apiMessageCombat(msg);

            console.log(data); // raw

            data = data.replace(/<img/gm, '#img');
            data = data.replace(/<(.*?)>/gm, '|');

            const j = JSON.parse(data);

            context.commit('SET_SHOW_COMBAT_INFO', j);
        }
    },
    UPDATE_COMBAT_DATA: async (context: Context): Promise<void> => {
        const id = state.showCombatId;

        const msg: IMessage = { combat: id, last: 0 };
        const data = await apiMessageCombat(msg) || [];
        context.commit('SET_SHOW_COMBAT_INFO', data);
    },
    ADD_FIGHTER_TO_TEAM: (context: Context, payload: {teamNumber: number; id: number }): void => {
        context.commit('ADD_FIGHTER_TO_TEAM', payload);
    },
    REMOVE_FIGHTER_FROM_TEAM: (context: Context, payload: {teamNumber: number; id: number }): void => {
        context.commit('REMOVE_FIGHTER_FROM_TEAM', payload);
    },
    SET_TEAM_NAME: (context: Context, payload: {teamNumber: number; name: string }): void => {
        context.commit('SET_TEAM_NAME', payload);
    },
    CLEAR_TEAM: (context: Context, teamNumber: number): void => {
        context.commit('CLEAR_TEAM', teamNumber);
    },
    SAVE_TEAMS_LOCAL: (): void => {
        const teams = JSON.stringify(state.teams);
        localStorage.setItem('y-teams', teams);
    },
    LOAD_TEAMS_LOCAL: (context: Context): void => {
        /*
        // from local
        const teams = localStorage.getItem('y-teams');
        if(teams) {
            const data = JSON.parse(teams);
            context.commit('LOAD_TEAMS', data);
        }
         */

    }
};
