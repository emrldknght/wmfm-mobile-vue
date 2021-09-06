import {Locale} from "../Locale.type";

const TFItems: Locale = {
    FItems: 'Снаряжение',
    Helmet :'Шлем',
    Bracers :'Наручи',
    mainWeapon :'Оружие',
    Gloves :'Перчатки',
    Leggings :'Голени / Поножи',
    Body :'Доспех корпуса',
    Shoulders :'Плечи',
    secondaryWeapon :'Оружие / Щит',
    Cuisses :'Бёдра',
    Foot : 'Защита стопы',
    itemsWeight : 'Вес снаряжения',
    maxWeight: 'Максимальный Вес',
};
const TFTraining: Locale = {
    Training: 'Тренировка',
    trainnothing: "Отдыхать",
    trainstrength: "Упражнения с гирями",
    traindextirity: "Акробатика и паркур",
    trainstamina: "Изнурительные походы",
    trainno: "---------------------------------",
    trainsword : "Одноручный меч",
    trainshield: "Щит",
    trainbastard: "Полутораручный меч",
    trainmorningstar: "Дробящее оружие",
    trainpolyarm: "Древковое оружие",
    trainwrestling: "Борьба",
};

export const TFighterInfo: Locale = {
    Status: 'Статус',
    Busy: 'Занят',
    placedToTransfer: 'Выставлен на трансфер',
    Trauma: 'Травма',
    Age : 'Возраст',
    Height: 'Рост',
    Weight: 'Вес',
    Eff: 'Эффективность',
    Wins: 'Побед',
    Loses: 'Поражений',

    strength: 'Сила',
    dexterity : 'Ловкость',
    stamina: 'Выносливость',

    Skills: 'Навыки',
    sword: 'Однаручный меч',
    shield: 'Щит',
    morningStar: 'Дробящее',
    bastard: 'Полутораруч. меч',
    poleArm: 'Древковое',
    wrestling: 'Борьба',

    ...TFItems,
    ...TFTraining,
    Hire: 'Выгнать бойца из клуба'
};
