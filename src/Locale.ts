import ConsoleW from "./lib/ConsoleW";
import {LocEn} from "./locale/en/LocEn";

export const Localization = {
    en: LocEn
};
export function localeKey(key: string): Function {
    const  fk = Localization['en'][key];
    return (typeof fk === 'function') ? fk : (): void => { ConsoleW.error(`loc key ${key} is not function`) }
}
export function locale(textBit: string, warn = true): string | Function {
    if(textBit.length === 0) return '';

    const text = textBit.charAt(0).toUpperCase() + textBit.substr(1);

    const l = Localization['en'][textBit];
    if(l) {
        // if (warn) console.warn(`string ${textBit} localized to ${l}`);
        return l;
    } else {
        const m = (l === '') ? 'Value is empty' : 'Missing key';
        if (warn) console.warn(`string ${textBit} is not localized! - ${m}`);
        return text;
    }

    // return Localization['en'][textBit] || text;
}
