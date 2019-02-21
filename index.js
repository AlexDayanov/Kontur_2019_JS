const { readLine, displayRecords } = require('./console');
const { getAllFilePathsWithExtension, readFile, getFileName } = require('./fileSystem');

console.log('Please, write your command!');

readLine(input => {
    let command = parseInput(input);

    switch (command.name) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            show({ filter: importantFilter });
            break;
        case 'user':
            show({ filter: userFilter, args: command.user });
            break;
        case 'sort':
            show({ sort: sortBy, args: command.fieldName });
            break;
        case 'date':
            show({ filter: dateFilter, args: command.date });
            break;
        default:
            console.log('wrong command');
            break;
    }
});

function parseInput(input) {
    let parts = input.split(' ').map(c => c.trim());

    if (parts.length == 1) {
        if (parts[0] == 'show') {
            return { name: 'show' }
        }
        else if (parts[0] == 'important') {
            return { name: 'important' }
        }
    } if (parts.length == 2) {
        if (parts[0] == 'user') {
            return { name: 'user', user: parts[1] }
        }
        if (parts[0] == 'sort') {
            return { name: 'sort', fieldName: parts[1] }
        }
        if (parts[0] == 'date') {
            return { name: 'date', date: parts[1] }
        }
    }

    return {};
}

function show(options) {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');

    let todos = loadTodoComments(filePaths);

    console.log(todos);

    if (options && options.filter) {
        todos = todos.filter(options.filter(options.args))
    }

    if (options && options.sort) {
        todos.sort(options.sort(options.args))
    }

    displayRecords(todos);
}

function loadTodoComments(files) {
    const Regex = {
        todo: /\/{2}\s*todo\s*:*\s*(?:(.*?)\s*;\s*(.*|\d{4}-\d{2}-\d{2});\s*(.*)|(.*))/i,
        importance: /.*?(!+)/,
        fileName: /\/(.*\.js)/i
    };

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

function importantFilter() {
    return function (todo) {
        return todo.importance.length > 0;
    }
}

function userFilter(user) {
    user = user.toLowerCase();
    return function (todo) {
        return todo.user.toLowerCase().startsWith(user);
    }
}

function dateFilter(date) {
    
    date = prepareDate(date);

    return function (todo) {
        return prepareDate(todo.date) >= date;
    }

    function prepareDate(d){
        return d
            .replace(/-/g, '')
            .padEnd(8,'0')
            .substring(0, 8);
    }
}

function sortBy(fieldName) {
    switch (fieldName) {
        case 'importance': {
            return function (todo1, todo2) {
                return todo2.importance.length - todo1.importance.length
            }
        }
        case 'user': {
            return function (todo1, todo2) {
                if (todo2.user == '' && todo1.user != '') {
                    return -1
                }

                if (todo2.user != '' && todo1.user == '') {
                    return 1
                }

                return todo2.user > todo1.user ? -1
                    : todo2.user < todo1.user ? 1
                        : 0
            }
        }
        case 'date': {
            return function (todo1, todo2) {
                if (todo2.date == '' && todo1.date != '') {
                    return -1
                }

                if (todo2.date != '' && todo1.date == '') {
                    return 1
                }

                return todo2.date > todo1.date ? 1
                    : todo2.date < todo1.date ? -1
                        : 0
            }
        }
    }
}



// TODO you can do it!
