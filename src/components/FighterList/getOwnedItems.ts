import {IItem} from "../../interfaces/IItem";

export type OwnedItem = { class: string | undefined; type: string | undefined };

export function getOwnedItems(items: IItem[], sid: string): OwnedItem[] {
    return items
        .filter(e => e.dressed === sid && (e.class === 'weapon' || e.class === 'shield'))
        // .map(e => ({ name: e.name, id: e.id }))
        // .map(e => ({ name: e.name, id: e.id, type: e.type }))
        .map(e => ({ class: e.class, type: e.type }))
}