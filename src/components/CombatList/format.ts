import {Options} from "../../Options";

type TeamFighter = { image: string; name: string };

const imTag = /#(.*?)>/gm;
const imgSrc = (txt: string): string => {
    const match = txt.match(/src="[^"]+"/gm);
    return (match) ? match[0] : '';
};

const imgSrcValue = (src: string): string => src.substring(5, src.length - 1);
const imgFileName = (val: string): string => val.substring(val.lastIndexOf('/') + 1);
const getFileName = (t: string): string => imgFileName(imgSrcValue(imgSrc(t)));

export function formatTeam(text: string): TeamFighter[] {
    // console.log('ft', text);
    if(!text) return [];

    const team: TeamFighter[] = [];

    const m = text.match(/#img([^#]+)/gm) || [];

    m.forEach((e: string) => {
        let file = '';
        const iT = e.match(imTag);
        if(iT) {
            file = getFileName(iT[0]);
        }

        let text = e.replace(imTag, '');
        text = text.replace(/[|]/gm, '');
        text = text.trim();

        team.push({ image: file, name: text })
    });

    return team;
}

function showShield(path: string): string {
    return `<img src="${Options.serverPath}/img/clubbanners/small/${path}" height="11" width="11" alt="club banner">`;
}

export function formatEvent(text: string): string {
    if(!text) return '';

    text = text.replace(/[|]/gm, '');
    text = text.replace(/[>]/gm, '$');

    const hashes = text.split('').filter(e => e === '#').length;

    for(let i = 0; i < hashes; i++) {
        const start = text.indexOf('#');
        const end = text.indexOf('$');
        const fileName = getFileName(text.substring(start, end));
        const shield = showShield(fileName);
        text = text.substring(0, start) + `${shield}` + text.substring(end + 1);
    }

    return text;
}


