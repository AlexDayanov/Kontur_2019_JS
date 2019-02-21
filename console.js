const readline = require('readline');

const tabFormat = {
    delimiter: '|',
    spacer: '  ',
    underline: '-',
    terminator: '...',

    maxLength: {
        importance: 1,
        user: 10,
        date: 10,
        comment: 50,
        fileName: 15
    },

    header: {
        importance: '!',
        user: 'user',
        date: 'date',
        comment: 'comment',
        fileName: 'fileName'
    }
};

// TODO ; 2018-10-01; Можно ли написать более лаконично?
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function readLine(callback) {
    rl.on('line', callback); // TODO pe; 2015-08-10; а какая будет кодировка?
}

// TODO digi; 2016-04-08; добавить writeLine!!!

function printOut(array) {
    array.forEach(element=>{
        console.log(element.valueOf());
    })
}

//Принимает массив объектов-записей и выводит их в консоль
function displayRecords(array) {
    //Нормализованные длины строк для каждого поля в объекте-записи
    let normalizedLengths = getNormalizedLengths(array, tabFormat.maxLength);

    let header = getStrings([tabFormat.header], normalizedLengths);
    let strings = getStrings(array, normalizedLengths);
    let underline = ['-'.repeat(header[0].length)];

    let table = header.concat(underline.concat(strings));

    printOut(table);
}

// Принимает массив объектов-записей и объект максимальных длин строк,
// возвращает Map, где key-имя поля value-нормализованная длина строки (т.е. не превышающая максимальную)
function getNormalizedLengths(array, maxLength) {
    let lengths = new Map();
    array.forEach(record => {
        let keys = Object.keys(record);
        keys.forEach(key => {
            let max = maxLength[key];
            let val = lengths.get(key) ? lengths.get(key) : 0;
            let newVal = record[key].length;
            if (val < newVal) {
                lengths.set(key, newVal < max ? newVal : max)
            }
        })
    });
    return lengths;
}

//Принимает массив объектов-записей и Map,содержащий нормализованные длины строк.
// Возвращает массив отформаитрованных строк
function getStrings(array, normalizedLengths) {
    let strings = [];
    array.forEach(record => {
        keys = Object.keys(record);

        //Принимает два массива: литералов и подстановочных переменных.
        // Возвращает строку, отформатированную по шаблону
        function f(strings, ...values) {
            let str = "";
            for (let i = 0; i < values.length; i++) {
                str += strings[i];
                str += formatStr(values[i], keys[i]);
            }
            return str;
        }
            //Обрезает или удлиняет строки до одинаковой длины
        function formatStr(value, key) {
            if (key === 'importance') {
                return value ? '!' : ' '
            } else {
                let nL = normalizedLengths.get(key);
                let vL = value.length;
                if (vL > nL) {
                    return value.substr(0, nL - 3) + tabFormat.terminator
                } else return value + (x = ' '.repeat(nL - vL));
            }
        }
        //Шаблон передает функции f() массив литералов и массив подстановочных выражений
        let str = f`  ${record.importance}  |  ${record.user}  |  ${record.date}  |  ${record.comment}  |  ${record.fileName}`;
        //Запись строк в массив
        strings.push(str);
    });
    return strings;
}

module.exports = {
    readLine,
    displayRecords
};


