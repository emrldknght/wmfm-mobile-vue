import {parseIntE} from "./parseIntE";
import {parseFloatE} from "./parseFloatE";

export enum SortType {
    Default = '',
    Name = 'id', //'name',
    Height = 'height',
    Weight = 'weight',
    Age = 'age',
    Str = 'strength',
    Dex = 'dextirity',
    Sta = 'stamina',
    Eff = 'effectiveness',
    //
    Sword = 'sword',
    Shield = 'shield',
    Blunt = 'morningstar',
    Bastard = 'bastard',
    Polearm = 'polyarm',
    Wrestling = 'wrestling',
}

export enum SortDirection {
    Default = '',
    Up = 'desc',
    Down = 'asc',
}

function sortInt(a: IFighter, b: IFighter, key: SortType, v: number): number {
    if(key === SortType.Default) return 0;

    const aKey = parseIntE(a[key]);
    const bKey = parseIntE(b[key]);
    if (aKey > bKey) return -1 * v;
    if (aKey < bKey) return v;
    return 0;
}

function sortFloat(a: IFighter, b: IFighter, key: SortType, v: number): number {
    if(key === SortType.Default) return 0;

    const aKey = parseFloatE(a[key]);
    const bKey = parseFloatE(b[key]);
    if (aKey > bKey) return v * -1;
    if (aKey < bKey) return v;
    return 0;
}

const direction = (d: SortDirection): number => (d === SortDirection.Down) ? 1 : -1;

export const SortFunction = {
    [SortType.Default]: (): number => {
        return 0;
    },
    [SortType.Name] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        const v = direction(d);
        const aName = a.name ?? '';
        const bName = b.name ?? '';
        if (aName < bName) return -1 * v;
        if (aName > bName) return v;
        return 0;
    },
    [SortType.Height] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortFloat(a, b, SortType.Height, direction(d));
    },
    [SortType.Weight] : (d: SortDirection, a: IFighter, b: IFighter): number => {

        return sortFloat(a,b, SortType.Weight, direction(d));
    },
    [SortType.Age] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Age, direction(d));
    },
    [SortType.Str] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Str, direction(d));

    },
    [SortType.Dex] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Dex, direction(d));
    },
    [SortType.Sta] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Sta, direction(d));
    },
    [SortType.Sword] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Sword, direction(d));
    },
    [SortType.Shield] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Shield, direction(d));
    },
    [SortType.Blunt] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Blunt, direction(d));
    },
    [SortType.Bastard] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Bastard, direction(d));
    },
    [SortType.Polearm] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Polearm, direction(d));
    },
    [SortType.Wrestling] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortInt(a, b, SortType.Wrestling, direction(d));
    },
    [SortType.Eff] : (d: SortDirection, a: IFighter, b: IFighter): number => {
        return sortFloat(a, b, SortType.Eff, direction(d));
    }
};
