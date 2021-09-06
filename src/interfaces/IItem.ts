export interface IItem {
    id?: string;
    name?: string;
    flavertext?: string;
    img?: string;
    class?: string;
    type?: string;
    bodypart?: string;
    defence?: string;
    damage?: string;
    speed?: string;
    weight?: string;
    length?: string;
    durability?: string;
    maxdurability?: string;
    cost?: string;
    trauma?: string;
    authentic?: string;
    beauty?: string;
    owner?: string;
    dressed?: string;
    forgery?: string;
    tosell?: string;
    action?: string;
    repaircost?: number;

    //service key for repair screen
    bp?: number;
}

// type KeysEnum<T> = { [P in keyof Required<T>]: true };

