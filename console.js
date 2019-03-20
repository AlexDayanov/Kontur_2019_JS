const readline = require('readline');

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

//Принимает массив объектов-записей и выводит их в консоль
function displayRecords(array) {
    let sizeLimits = [1, 10, 10, 50, 15];
    let maxSizes = [1, 4, 4, 7, 8]
    let data =
        [
            ['!', 'user', 'date', 'comment', 'fileName']
        ]

    array.forEach(element => {
        recalcMaxSize(1, element.user);
        recalcMaxSize(2, element.date);
        recalcMaxSize(3, element.comment);
        recalcMaxSize(4, element.fileName);

        data.push(
            [
                element.importance.length > 0 ? '!' : '',
                element.user,
                element.date,
                element.comment,
                element.fileName,
            ]);
    });

    let result = '';
    for (row = 0; row < data.length; row++) {
        let outCells = [];

        for (col = 0; col < data[row].length; col++) {
            outCells.push(formatCell(data[row][col], maxSizes[col]));
        }

        let outRow = formatRow(outCells);

        result += outRow;

        if (row == 0 || row == data.length - 1) {
            result += '-'.repeat(outRow.length - 1) + '\n';
        }
    }

    console.log(result);

    function recalcMaxSize(index, value) {
        if (value.length > maxSizes[index]) {
            maxSizes[index] = Math.min(sizeLimits[index], value.length);
        }

        // if (value.length > maxSizes[index]) {
        //     maxSizes[index] = value.length > sizeLimits[index]
        //     ? sizeLimits[index]
        //     : value.length
        // }
    }

    function formatCell(value, sizeLimit) {
        let v = value ? value : '';

        v = v.length <= sizeLimit
            ? v.padEnd(sizeLimit)
            : v.substring(0, sizeLimit - 3) + '...'

        return `  ${v}  `;
    }

    function formatRow(values) {
        return values.join('|') + '\n';
    }
}

module.exports = {
    readLine,
    displayRecords
};


