import {Options} from "../../Options";

export function getBannerPath(path: string): string {
    return `${Options.serverPath}img/clubbanners/small/` + path;
}

export function clubBanner(item: IFighter): string {
    // return `${Options.serverPath}img/clubbanners/small/` + item.banner;
    return getBannerPath(item.banner || '');
}
