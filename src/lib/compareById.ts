export function compareById(a: IFighter, b: IFighter): number {
    const aId: string = a.id ?? '-1';
    const bId: string = b.id ?? '-1';
    if (aId < bId) {
        return -1;
    }
    if (aId > bId) {
        return 1;
    }
    return 0;
}
