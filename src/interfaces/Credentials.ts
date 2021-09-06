export interface Credentials {
    login: string;
    password: string;
}

export const emptyCred: Credentials = { login: '', password: '' };

export function saveCred(cred: Credentials): void {
    let key: keyof Credentials;
    for(key in cred) {
        if(Object.prototype.hasOwnProperty.call(cred, key)) {
        // if (cred.hasOwnProperty(key)) {
            localStorage.setItem(key, cred[key]);
        }
    }
}
export function getCred(): Credentials {
    const ci: Credentials = emptyCred;
    let key: keyof Credentials;
    for(key in ci) {
        if(Object.prototype.hasOwnProperty.call(ci, key)) {
        // if (ci.hasOwnProperty(key)) {
            const credString = localStorage.getItem(key);
            if(credString) {
                ci[key] = credString;
            }
        }
    }
    return ci;
}
export function isCredEmpty(cred: Credentials): boolean {
    return(cred.login === emptyCred.login || cred.password === emptyCred.password);
}
export function removeCred(): void {
    const ci: Credentials = emptyCred;
    let key: keyof Credentials;
    for(key in ci) {
        if(Object.prototype.hasOwnProperty.call(ci, key)) {
        // if (ci.hasOwnProperty(key)) {
            localStorage.removeItem(key);
        }
    }
}
