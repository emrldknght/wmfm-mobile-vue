import {parseTime} from "./parseTime";

export function traumaLeft(time: string): string {
    const duration = parseInt(time);
    const remainingTime = Math.max(duration, 0);

    return parseTime(remainingTime);
}
