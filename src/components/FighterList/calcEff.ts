import {parseIntE} from "../../lib/parseIntE";
import {WeaponIconKey} from "./WeaponIconKey";

type FighterStats = [WeaponIconKey, number, WeaponIconKey | '', number, WeaponIconKey, number] | [];

export function calcEff(fighter: IFighter): FighterStats {
    // const str = parseIntE(fighter.strength);
    // const sta = parseIntE(fighter.stamina);
    // const dex = parseIntE(fighter.dextirity);
    // const m = (str + sta + dex) / 3;

    const sword = parseIntE(fighter.sword);
    const blunt = parseIntE(fighter.morningstar);

    const shield = parseIntE(fighter.shield);

    const bastard = parseIntE(fighter.bastard);
    const pole = parseIntE(fighter.polyarm);

    const wrest = parseIntE(fighter.wrestling);

    const topSkill = Math.max(sword, blunt, bastard, pole);
    /*
    if(topSkill === sword) {

    }
     */
    // $effectiveness=$fighter['strength']+$fighter['dextirity']+$fighter['stamina']+(Х)+(Y*10)
    // +$fighter['sword']+$fighter['shield']+$fighter['morningstar']+$fighter['bastard']+$fighter['polyarm']+$fighter['wrestling']+
    // (($fighter['weight']+$fighter['height'])/100);
    // return m.toFixed(1);

    switch (topSkill) {
        case sword:
            return [WeaponIconKey.Sword, sword,  WeaponIconKey.Shield, shield, WeaponIconKey.Wrestling, wrest ]; //`${sword}S|${shield}`;
        case blunt:
            return [WeaponIconKey.Blunt, blunt, WeaponIconKey.Shield, shield, WeaponIconKey.Wrestling, wrest ]; //`${blunt}B|${shield}`;
        case bastard:
            return [WeaponIconKey.Bastard, bastard ,'', 0, WeaponIconKey.Wrestling, wrest ]; //`${bastard}L`;
        case pole:
            return [WeaponIconKey.Polearm, pole, '', 0, WeaponIconKey.Wrestling, wrest ]; // `${pole}P`;
        default:
            return [];
    }

    // return parseFloat(this.$props.fighter.effectiveness).toFixed(1);
}
