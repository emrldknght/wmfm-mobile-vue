import {IItem} from "../../interfaces/IItem";
import {parseIntE} from "../../lib/parseIntE";

// export const sortUp = (key: keyof IItem, a: IItem, b: IItem) => sort(key, -1, a, b);
// export const sortDown = (key: keyof IItem, a: IItem, b: IItem) => sort(key, 1, a, b);

export const sortDown = (key: keyof IItem, a: IItem, b: IItem): number => {
    const aP = parseIntE(a[key] as string);
    const bP = parseIntE(b[key] as string);

    return +(aP < bP) - +(bP < aP);

    /*
    if(aP > bP) return -1;
    if(aP < bP) return 1;
    return 0;

     */
};
export const sortUp = (key: keyof IItem, a: IItem, b: IItem): number => {
    const aP = parseIntE(a[key] as string);
    const bP = parseIntE(b[key] as string);
    return +(bP < aP) - +(aP < bP);

    /*
    if(aP < bP) return -1;
    if(aP > bP) return 1;
    return 0;

     */
};
