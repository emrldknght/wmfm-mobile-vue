import {Locale} from "../Locale.type";

export const TTrainingBaseAll: Locale = {
    base: 'База',
    ticketPrice: 'Цена билета',
    change: 'Изменить',
    attraction: 'Привлекательность для зрителей',
    square: 'Площадь',
    advSquare: 'Рекламная площадь',
    watchers: 'Зрители',
    dailyRent: 'Аренда в сутки',
    transferCost: 'Стоимость переезда',
    chair: 'Стулья',
    bench: 'Скамьи',
    recliner: 'Ряды кресел',
    coltribune: 'Разборные трибуны',
    tribune: 'Трибуны',
    sector: 'Секторы',
    transfer: 'Переезд',

    confirmBuyBaseItem: (name: string, cost: number) => `Вы уверены что хотите приобрести предмет ${name} за ${cost}?`,
};
const max: Locale = {
    // max
    maxChair: TTrainingBaseAll.chair,
    maxBench: TTrainingBaseAll.bench,
    maxRecliner: TTrainingBaseAll.recliner,
    maxColTribune: TTrainingBaseAll.coltribune,
    maxTribune: TTrainingBaseAll.tribune,
    maxSector: TTrainingBaseAll.sector,
};
export const TTrainingBase: Locale = {
    ...TTrainingBaseAll,
    ...max
};
