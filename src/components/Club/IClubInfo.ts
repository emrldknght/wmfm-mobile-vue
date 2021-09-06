import {IClubAward} from "./IClubAward";

export interface IClubInfo {
    id: string; //"1",
    name: string; //"Сергей Новиков",
    regtime: string; //"1",
    time: string; //"1578995936",
    club: string; //"Смертоносные упорыши",
    "rights": string; //"0",
    "money": string; //"40096.71",
    "rubles": string; //"348.00",
    "lastlogin": string; //"0",
    "rating": string; //"169",
    "img": string; //"001.png",
    "win": string; //"295",
    "lose": string; //"213",
    "banner_history": string; //"",
    "premium": string; //"0",
    "france": string; //"Prester Johan de Ynde",
    "english": string; //"Prester John  ",
    "fighters": number; //30,
    "place": number; //1,
    "awards": IClubAward[];
}
