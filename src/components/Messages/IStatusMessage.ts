enum IStatusMessageType {

}

export enum MessageClass {
    Finance = 'fin',
    CombatResult = '_fin',

    //client
    CombatStarted = 'combat-started',
    GotTrauma = 'got-trauma',
    FinishedTraining = 'finished-training',
    Healed = 'healed'
}

export interface IStatusMessage {
    time: string;
    msg: string;
    type: IStatusMessageType;
    class?: MessageClass;
}
