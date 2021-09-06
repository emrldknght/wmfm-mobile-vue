const LocEn = {
    Busy: 'is Busy',

    Wins: 'Wins',
    Loses: 'Loses',

    Str: 'Strength',
    Dex: 'Dexterity',
    Sta: 'Stamina',

    morningStar: 'Morning Star',
    poleArm: 'Pole Arm',

    maxWeight: 'Max Weight',

    mainWeapon: 'Main Weapon',
    secondaryWeapon: 'Sec. Weapon / Shield',

    notFullyEquipped: 'Not fully equipped',

    confirmHire: (name) => `Вы уверены что хотите выгнать бойца ${name}?`
};
export const Localization = {
    en: LocEn
};
export function localeKey(key) {
    const  fk = Localization['en'][key];
    return (typeof fk === 'function') ? fk : () => { console.error(`loc key ${key} is not function`) }
}
export function locale(textBit) {
    const text = textBit.charAt(0).toUpperCase() + textBit.substr(1);
    return Localization['en'][textBit] ?? text;
}
