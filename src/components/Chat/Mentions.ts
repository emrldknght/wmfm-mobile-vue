import {Options} from "../../Options";
import {IChatMessageList} from "./IChatMessage";

interface Mention {
    index: number; viewed: boolean;
}
export interface Mentions { [key: number]: Mention }

const mentionFormatReg = /^(.)+(&gt;&gt;|>>)/m;
// const matchMention = (text: string): string[] => (text.match(mentionFormatReg) ?? []);
const matchMention = (text: string): string[] => (mentionFormatReg.exec(text) ?? []);
const getMentionFromMatch =
    (match: RegExpMatchArray): string => match[0].substring(0, match[0].length - match[2].length).trim();

const addMentionToData = (data: Mentions, key: string, index: number): void => {
    // console.log(`${key}:${mention}:${isMentioned}`);
    const ik: number = parseInt(key);
    if(!data[ik]) {
        // console.log('push new mention', ik, index);
        data[ik] = { index, viewed: false };
    }
};

export function getMentions(messages: IChatMessageList, mentions: Mentions): void {

    const name: string = Options.playerInfo.name ?? '';
    // const name: string = 'Сергей Новиков';//

    let index = 0;
    for (const [key, val] of Object.entries(messages)) {
        const text = val.text;
        const match = matchMention(text);

        if (match.length > 0) {
            const mention = getMentionFromMatch(match);
            const isMentioned = mention === name;

            if (isMentioned) {
                // console.log(`${key}:${mention}:${isMentioned}`);
                addMentionToData(mentions, key, index);
            }
        }
        index++;
    }
}
