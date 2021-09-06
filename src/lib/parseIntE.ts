export function parseIntE(value: string | undefined | null, r = -1): number {
    return (value) ? parseInt(value) : r;
}