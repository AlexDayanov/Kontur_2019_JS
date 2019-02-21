const {getAllFilePathsWithExtension, readFile, getFileName} = require('./fileSystem');
const {readLine, readline, displayRecords} = require('./console');
const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
const Regex = {
    todo: /\/{2}\s*todo\s*:*\s*(?:(.*);\s*(.*|\d{4}-\d{2}-\d{2});\s*(.*)|(.*))/i,
    importance: /.*?(!+)/,
    fileName: /\/(.*\.js)/i
};
const maxStringLength = {
    importance: 1,
    user: 10,
    date: 10,
    comment: 50,
    fileName: 15
}

app();

function app() {
    console.log('Please, write your command!');
    readLine(processCommand);
}

function show() {
    displayRecords (createTodoArray(filePaths));
}

function createTodoArray(files) {
    let records = [];
    files.forEach(fileName => {
        lines = getTodoLines(fileName);
        lines.forEach(line => {
            records.push({
                line: line,
                fileName: fileName
            })
        })
    });

    function getTodoLines(fileName) {
        return readFile(fileName).split('\n').filter((line) => {
            return Regex.todo.test(line);
        })
    }

    let arr = records.map((record) => {
        let content = Regex.todo.exec(record.line);
        let importance = Regex.importance.exec(record.line);
        let file = getFileName(record.fileName);

        return {
            importance: importance ? importance[1] : '', // TODO Alex ; 1234-56-78; Нужно что-то сделать с этим костылём!!!!
            user: ret(content[1]),
            date: ret(content[2]),
            comment: ret(content[3], content[4]),
            fileName: ret(file)
        }

        function ret(arg1, arg2) {
            return arg1 ? arg1 : (arg2 ? arg2 : '')
        }
    });
    return arr;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
