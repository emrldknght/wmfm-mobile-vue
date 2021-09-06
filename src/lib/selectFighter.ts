import Vue from 'vue';

export function selectFighter(ctx: Vue, id: number): Promise<void> {
    ctx.$store.dispatch('SELECT_FIGHTER', id);
    ctx.$store.dispatch('GET_SELECTED_FIGHTER_DATA');
    return ctx.$store.dispatch('GET_SELECTED_FIGHTER_INVENTORY');
}
