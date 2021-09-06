export function parseFloatE(value: string | undefined | null, r = -1.0): number {
    return (value) ? parseFloat(value) : r;
}