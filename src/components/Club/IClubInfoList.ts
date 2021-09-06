import {IClubInfo} from "./IClubInfo";

export interface IClubInfoList {
    [key: string]: IClubInfo | number | undefined;
    pages?: number;
}
