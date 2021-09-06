import {IItem} from "./IItem";

export interface ISlots {
    helmet?: string;
    bracers?: string;
    righthand?: string;
    glowes?: string;
    jambs?: string;
    torso?: string;
    shoulderpads?: string;
    lefthand?: string;
    cuisses?: string;
    boots?: string;
    // to prevent error in forEach
    [propName: string]: string | undefined | IItem;
}