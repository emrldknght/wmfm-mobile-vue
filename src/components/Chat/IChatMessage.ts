export interface IChatMessageList {
    [key: string]: IChatMessage;
}

//{ "122": {
// "time": "[14.10.19 10:44:10]",
// "clubid": "16",
// "clubpic": "055.png",
// "clubname":
// "Графство Арундел",
// "name": "Алексей Бакуменко",
// "text": "Ку, чат только с мобильной версии?"
// }

export interface IChatMessage {
    "time": string;
    "clubid": string;
    "clubpic": string;
    "clubname": string;
    "name": string;
    "text": string;
}
