import {Screens} from "../../interfaces/AppScreen/Screens";

export type OptionType = 'text' | 'bool' | 'radio' | 'list';
type OptionValues = string[] | [string, string][]

export type Option = { name: string; type: OptionType; values?: OptionValues; value: boolean | string };
export type TScreenOptions = {
    [key in Screens]?: { [key: string]: string }
};

export const ScreenOptions: {[key in Screens]?: Option[] } = {
    [Screens.Default]: [],
    [Screens.CombatFriendly]: [
        {
            name: 'autoResizeTeam', type: 'bool', value: true
        },
        {
            name: 'testOption1', type: 'text', value: 'string 1'
        },
        {
            name: 'radioOption1',
            type: 'radio',
            values: [
                '0', '1', '2'
            ],
            value: '2'
        },
        {
            name: 'list1',
            type: 'list',
            values: [
                [ 'first', 'One' ],
                [ 'second', 'Two' ],
                [ 'third', 'Three' ],
            ],
            value: 'second'
        }
    ]
};
