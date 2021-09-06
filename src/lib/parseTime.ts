export function parseTime(remainingTime: number): string {
    // const months = (seconds: number): number => Math.floor(seconds / (60 * 60 * 24 * 30));
    // const days = (seconds: number): number => Math.floor(seconds / (60 * 60 * 24));
    const hours = (seconds: number): number => Math.floor(seconds / (60 * 60));
    const minutes = (seconds: number): number => Math.floor(seconds / 60) % 60;
    const seconds = (seconds: number): number => seconds % 60;

    /*
    const rMo = months(remainingTime);
    remainingTime -= rMo * (60 * 60 * 24 * 30);
    const rD = days(remainingTime);
    remainingTime -= rD * (60 * 60 * 24);
     */

    const rH = hours(remainingTime);
    const rM = minutes(remainingTime);
    const rS = seconds(remainingTime);

    // const stringMo = (months: number): string => (months > 0) ? `${months} M` : '';
    // const stringD = (days: number): string => (days > 0) ? `${days} d` : '';
    const stringH = (hours: number): string => (hours > 0) ? `${hours} h` : '';
    const stringM = (minutes: number): string => (minutes > 0) ? `${minutes} m` : '';
    const stringS = (seconds: number): string => `${seconds} sec`;


    return `${stringH(rH)} ${stringM(rM)} ${stringS(rS)}`;
}
