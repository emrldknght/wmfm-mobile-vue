import {Locale} from "../Locale.type";
import {TButtons} from "./TButtons";
import {TCombat} from "./TCombat";
import {TClubInfo} from "./TClubInfo";
import {TDialog} from "./TDialog";
import {TTrainingBase} from "./TTrainingBase";
import {TFighterInfo} from "./TFighterInfo";
import {TFighterList} from "./TFighterList";
import {TRecruit} from "./TRecruit";
import {TInventory} from "./TInventory";
import {TMarket} from "./TMarket";
import {TShop} from "./TShop";
import {TRepair} from "./TRepair";
import {TPremiumShop} from "./TPremiumShop";
import {TTeams} from "./TTeams";



export const LocEn: Locale = {
    Loading: 'Загрузка',
    Quit: 'Выход',
    club: 'Клуб',

    ...TDialog,
    ...TButtons,
    ...TClubInfo,
    clubList: 'Клубы',
    pages: 'Страницы',
    ...TTrainingBase,
    ...TFighterList,
    ...TFighterInfo,
    ...TTeams,
    ...TRecruit,
    Transfer: 'Трансфер',
    transferHeader: 'Выставленные на трансфер бойцы',
    placeTransfer: 'Выставить бойца на трансфер',
    transferFor: 'Заключить контракт',
    transferReturn: 'Вернуть с трансфера',
    ...TInventory,
    ...TMarket,
    ...TShop,
    ...TRepair,
    ...TCombat,
    championship: 'Чемпионат',
    messages: 'Игровые сообщения',
    chat: 'Чат',
    autoScrollToBottom: 'Автопрокрутка',
    send: 'Отправить',
    mentions: 'Упоминания',
    ...TPremiumShop,
    // Busy: 'is Busy',

    // Wins: 'Wins',
    // Loses: 'Loses',

    // Str: 'Strength',
    // Dex: 'Dexterity',
    // Sta: 'Stamina',

    // morningStar: 'Morning Star',
    // poleArm: 'Pole Arm',
    // maxWeight: 'Max Weight',
    // mainWeapon: 'Main Weapon',
    // secondaryWeapon: 'Sec. Weapon / Shield',
    // notFullyEquipped: 'Not fully equipped',
    Wrestling: 'Борьба',
    Summary: 'Обзор',

    confirmHire: (name: string) => `Вы уверены что хотите выгнать бойца ${name}?`,

    //inventory

};
