// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceObject(res: object | Array<any>): any {
    return (Array.isArray(res) && res.length === 0) ? {} : res;
}