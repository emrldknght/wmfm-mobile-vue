enum LogType {
    Normal = 'normal',
    Warning = 'warning',
    Error = 'error'
}

interface Style {
    color: string;
    bg: string;
}

type Styles = {
    [key in LogType]?: Style
}


const Colors: Styles = {
    [LogType.Normal]: { color: '#fff', bg: '#162c2c' },
    [LogType.Warning]: { color: '#ff0', bg: '#111' },
    [LogType.Error]: { color: '#f00', bg: '#111' }
};

const wrap = (text: string): string =>  '%c' + text;

/* eslint @typescript-eslint/no-explicit-any: off */
export default class ConsoleW {


    static logType: LogType =  LogType.Normal;
    static w = (style: Style | undefined): string => (style) ? `background: ${style.bg}; color: ${style.color}` : '';

    static getStyle(): string {
        switch (this.logType) {
            case LogType.Normal:
                return this.w(Colors[LogType.Normal]);
            case LogType.Warning:
                return this.w(Colors[LogType.Warning]);
            case LogType.Error:
                return this.w(Colors[LogType.Error]);
            default:
                return this.w(Colors[LogType.Normal]);
        }
    }

    private static resetLogType(): void {
        this.logType = LogType.Normal;
    }



    static warn(data: any): void {
        this.logType = LogType.Warning;
        console.warn(data);
        // this.log(data);
        this.resetLogType();
    }


    static error(data: any): void {
        this.logType = LogType.Error;
        console.error(data);
        //this.log(data);
        this.resetLogType();
    }


    static _log(...data: any): void {
        this.logType = LogType.Normal;
        this._log(data);
        this.resetLogType();
    }

    static log(...data: any): void {
        // console.log('call qw');
        // if(this.logType !== LogType.Normal) console.log(data);

        const out = [];
        let s = '';
        let i = 0;
        data.forEach((a: any) =>{
        // Array.from(arguments).forEach((a: any) =>{
            s += wrap(JSON.stringify(a));
            /*
            if(typeof a === 'object') {
                 s += this.wrap(JSON.stringify(a));
            } else {
                s += this.wrap(a);
            }
             */
            i++;
        });
        out.push(s);
        // console.log(out);

        for (let j = 0; j < i; j++) {
            out.push(this.getStyle());
        }

        // console.log(out);

        // console.log.apply(null, ['%c1%c22','color: red', 'color:green'])
        console.log.apply(null, out as any);
        if(this.logType !== LogType.Normal) console.trace();

        return;
        /*
        if(typeof data === 'object') {
            console.log(this.wrap(JSON.stringify(data)), this.style);
            return;
        }
        console.log(this.wrap(data), this.style);

         */
    }
}
