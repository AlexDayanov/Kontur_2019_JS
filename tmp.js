array = [];

const tabFormat = {
    delimiter: '|',
    spacer: '  ',
    underline: '_',
    terminator: '...'
};

header = {
    importance: '!',
    user: 'user',
    date: 'date',
    comment: 'comment',
    fileName: 'fileName'
};

record1 = {
    importance: '!!!',
    user: 'MotherFucker',
    date: '1234-56-78',
    comment: 'This is the fuckin comment of the some user',
    fileName: 'somefilexxxyyyzzza.js'
};

record2 = {
    importance: '',
    user: 'FuckMo',
    date: '9876-56-78',
    comment: 'comment of the some user ',
    fileName: 'somefileyyy.js'
};

maxLength = {
    importance: 1,
    user: 10,
    date: 10,
    comment: 50,
    fileName: 20
};

normalizedLengths = {
    importance: 1,
    user: 9,
    date: 10,
    comment: 45,
    fileName: 20
};

array.push(header, record1, record2);

array.forEach(record => {
    keys = Object.keys(record);

    function f(strings, ...values) {
        let str = "";
        for (let i = 0; i < values.length; i++) {
            str += strings[i];
            str += formatStr(values[i], keys[i]);
        }
        return str;
    }

    function formatStr(value, key) {
        if (key === 'importance') {
            return value ? '!' : ' '
        } else {
            let nL = normalizedLengths[key];
            let vL = value.length;
            if (vL > nL) {
                return value.substr(0, nL - 3) + tabFormat.terminator
            } else return value + (x = ' '.repeat(nL - vL));
        }
    }

    let str = f`  ${record.importance}  |  ${record.user}  |  ${record.date}  |  ${record.comment}  |  ${record.fileName}`;
    //console.log(str);
});



console.log([header]);

