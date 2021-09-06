import {Locale} from "../Locale.type";

export const TFighterList: Locale = {
    fighterListHeader: (amount: number) => `Бойцы: ${amount} из 30`,
    sort: 'Сортировка',
    fighterList: 'Бойцы',
    sortById: 'ID',
    sortByEff: 'эффективность',
    notFullyEquipped: 'Боец не одет полностью',

    busyInCombat: (num: number) => `Занят в бою ${num}.`,
};
