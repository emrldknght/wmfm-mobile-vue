import {IItem} from "../interfaces/IItem";
import {ICombatEvent} from "../components/Combat/ICombatEvent";
import {IScreen} from "../interfaces/IScreen";
import {Screens} from "../interfaces/AppScreen/Screens";
import {TScreenOptions} from "../components/AppScreenOptions/ScreenOptions";
import {IEquipState} from "../components/FighterList/IEquipState";

export interface State {
    screens: IScreen;

    fighters: IFighter[];
    selectedFighterId: number;
    selectedFighterData: IFighter;
    selectedFighterInventory: IItem[];

    storageItems: IItem[];
    selectedItemId: number;

    fightersEquipState: IEquipState;

    brokenItems: IItem[];

    showCombatId: number;
    showCombatInfo: ICombatEvent[];

    vault: {
        money: number;
        roubles: number;
    };

    fighterCategories: { [id: string]: string };
    screenOptions: TScreenOptions;
    teams: Teams;
}

export const state: State = {
    screens: {
        // [Screens.ShopTabs]: { folded: false },
        [Screens.PremiumShop] : { folded: false },
    },

    fighters: [],
    selectedFighterId: -1,
    selectedFighterData: {},
    selectedFighterInventory: [],

    storageItems: [],
    selectedItemId: -1,

    fightersEquipState: {},

    brokenItems: [],

    showCombatId: -1,
    showCombatInfo: [],

    vault: {
        money: 0,
        roubles: 0
    },

    fighterCategories: {},
    screenOptions: {},
    teams: {
        0: { name: '', ids: [] },
        1: { name: '', ids: [] },
        2: { name: '', ids: [] },
    }
};
