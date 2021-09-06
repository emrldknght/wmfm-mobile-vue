import {parseFloatE} from "./parseFloatE";

export function compareByEff(a: IFighter, b: IFighter): number {

    const aE = parseFloatE(a.effectiveness);
    const bE = parseFloatE(b.effectiveness);

    if (aE > bE) {
        return -1;
    }
    if (aE < bE) {
        return 1;
    }
    return 0;
}
