export enum ServerActions {
    isAuthorized = 'IsLoggedIn',
    GetServerTime = 'GetServerTime',

    GetClub = 'GetClub', // id
    GetClubList = 'GetClubList',

    GetMoney = 'refreshmoney',
    GetRoubles = 'refreshrubles',

    User = 'CleanUser',

    //+ Messages = 'InGameMessages',     // with_sess | last 100

    CombatList = 'CombatList',       //-_sess empty=self, id, all | last 100
    Combat = 'combat',

    MarketItems = 'GetMarketThings',    //-_sess =page, limit=
    BuyMarket = 'buymarket', //buymarket: [id]2116
    ShopItems = 'GetMastersThings',
    ShopItemSets = 'ArmorComplectsList',
    BuyItemSet = 'buyarmorcomplect',

    Inventory = 'UserThings',
    BrokenItems = 'BrokenThings',
    BuyItem = 'buymasters',
    DropItem = 'dropthing',
    SellItem = 'sellthing',
    CancelSell = 'returnthing',
    RepairItem = 'repair',
    EquipSets = 'UserComplects',
    SaveEquipSet = 'remembercomplect', // set number

    ClubMembers = 'ClubMembers',

    Fighter = 'CleanFighter',
    FighterInventory = 'DressedThings',

    FreeFighters = 'FreeFighters',
    RecruitLockTime = 'RecruitTime',
    TransferFighters = 'GetTransferFighters',  // page? Limit
    MakeTransfer = 'transferbuy',

    IsEquipped = 'IsEquipped', // + id
    IsMassEquipped = 'IsMassEquipped', // + ['id']
    SetTraining = 'SetTraining',
    TrainingProgress = 'TrainingProgress', // + ['id']

    RecruitFighter = 'invite',
    HireFighter = 'hire',
    PlaceTransfer = 'transfersell',

    FriendlyCombatList = 'FCombatApps', // id - from
    CheckFighter = 'checkfighter',

    BuyBase = 'buybase',
    TrainingBaseInfo = 'BaseList',
    SetTicketPrice = 'ticketcost',
    BuyBaseEquipment = 'buyinventory',

    PremiumShop = 'DonateShop',

    //App State
    GetStoredData = 'GetStoredData', //+ record_id
    GetUserData = 'GetUserData', //+ usr_id

    CreateUsrData = 'CreateUsrData', // +user_id, Txt
    // DEBUG!
    GetAllUsers = 'GetAllData',
    StoreData = 'StoreData', // + record_id, Txt
    GetData = 'GetData',

}

export type TServerAction = {
    [key in ServerActions]?: string
}


