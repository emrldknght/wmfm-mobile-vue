import {parseIntE} from "../../lib/parseIntE";


export type FighterStat = { fighter: string; stat: number[] };


function parseT(p: string[]): FighterStat[] {
    const h: { fighter: string; stat: number[] }[] = [];
    p.forEach((e: string) => {

        const fighterMatch = e.match(/[|]\D+\s+\D+/gm);
        const fighter = (fighterMatch) ? fighterMatch[0].substring(1, fighterMatch[0].length - 1) : 'no name';

        const statMatch = e.match(/[|]\d{1,2}/gm);
        const stat = (statMatch) ?statMatch.map(val => parseIntE(val.substring(1))) : [];

        h.push({fighter, stat});
    });

    /*
    p.forEach((e: string) => {
        console.log(e);
        const fighter = e.substring(0, e.length - 7);
        const statS = e.substring(fighter.length);

        const stat = statS.split('').map(e => parseInt(e));

        h.push({fighter, stat});
    });
     */
    return h;
}



export function parseResults(text: string): { header: string; teams: {}; text: string } | '' {
    // console.log('run results parser', text);
    if(!text) return '';

    const result = {
        header: '',
        teams: {},
        text: ''
    };

    let txt = text.replace(/\s+/gm, ' ');
    txt = txt.replace(/[|]+/gm, '|');

    const statsHeader = 'Статистика боя:';
    const statsStart = txt.indexOf(statsHeader);
    if(!statsStart) return '';

    result.header = txt.substring(0, statsStart);
    result.text = txt;

    let stats = txt.substring(statsStart + statsHeader.length).trim();
    // stats = stats.replace(/\s+/gm, ' ');
    stats = stats.replace(/[|]\s/gm, '');
    // console.log('stats', stats);

    const teamH = '|Хозяева:';
    const teamG = '|Гости:';

    const teamGStart = stats.indexOf(teamG);

    const teams: { h: FighterStat[]; g: FighterStat[] } = { h: [] , g: [] };

    const statsCHead = '|У:|П:|Д:|АЩ:|Щ:|Б:|Н:';
    // const fighterReg = /\S+\s+\D+\d{7}/gm;
    const fighterReg = /[|]\D+\s+\D+([|]\d{1,2}){7}/gm;


    const hStats = stats.substring(teamH.length + statsCHead.length, teamGStart);
    // console.log('hs->', hStats);
    const teamsHMatch = hStats.match(fighterReg); //RegExpMatchArray | null


    const gStats = stats.substring(teamGStart + statsCHead.length + teamG.length);
    // console.log('gs->', gStats);
    const teamsGMatch = gStats.match(fighterReg);


    teams.h = parseT(teamsHMatch || []);
    teams.g = parseT(teamsGMatch || []);

    // console.log('stats', stats);

    result.teams = teams;
    return result;
}
