/**
 * Return index of item with id in list
 * @param list
 * @param id
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findById(list: any[], id: number): number {
    let index = -1;
    list.forEach((e, pos) => {
        if (parseInt(e.id) === id) {
            index = pos;
        }
    });
    return index;
}
