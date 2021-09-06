const key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
    "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
    "","I","II","III","IV","V","VI","VII","VIII","IX"];

export function number2roman(num = 0): string {
    if (isNaN(num)) {
        return ''; // NaN;
    }

    const digits: Array<string> = String(+num).split("");
    let roman = "";
    let i = 3;

    while (i--) {
        //const p = +digits.pop();
        const p = parseInt(digits.pop() || '');
        roman = (key[p + (i * 10)] || "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
}
