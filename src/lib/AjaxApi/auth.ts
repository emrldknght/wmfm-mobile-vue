import {serverPath} from "./const";
import {showErrorInfoDialog} from "../../components/DialogWrapper/showErrorDialog";
import {IAnswer} from "../../interfaces/IAnswer";

export function auth(id: string, pass: string): Promise<IAnswer> {
    const url = new URL(serverPath);
    const usp = new URLSearchParams();

    usp.append('feature', 'mobile');
    usp.append('login', id);
    usp.append('passwd', pass);

    url.search = usp.toString();

    return new Promise(resolve => {
        fetch(url.toString(), {
            method: 'POST'
        }).then((res: Response) => {
            return res.json();
        }).then(j => {
            resolve(j);
        })
            .catch((e: Error) => showErrorInfoDialog(e.message));
    })

}
