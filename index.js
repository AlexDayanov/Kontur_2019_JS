const {readLine, displayRecords} = require('./console');
const {getAllFilePathsWithExtension, readFile, getFileName} = require('./fileSystem');

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
            show({filter: importantFilter});
            break;
        case 'user':
            show({filter: userFilter, args: command.args});
            break;
        case 'sort':
            show({sort: sortBy, args: command.args});
            break;
        case 'date':
            show({filter: dateFilter, args: command.args});
            break;
        default:
            console.log('wrong command');
            break;
    }
});

function parseInput(input) {
    const simpleCommands = ['exit', 'show', 'important'];
    const complexCommands = ['user', 'sort', 'date'];
    const complexParams = [, ['importance', 'user', 'date'],];

    const commandValid = function (parts) {
        if (complexCommands.includes(parts[0])) {
            i = complexCommands.indexOf(parts[0]);
            params = complexParams[i];
            return params ? params.includes(parts[1]) : true
        }
    }

    let parts = input.split(' ').map(c => c.trim());

    if (parts.length == 1 && simpleCommands.includes(parts[0])) {
        return {
            name: parts[0]
        }
    } else if (parts.length == 2 && commandValid(parts)) {
        return {
            name: parts[0], args: parts[1]
        }
    }

    return {};
}

function show(options) {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');

    let todos = loadTodoComments(filePaths);

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
            importance: importance ? importance[1] : '',
            user: ret(content[1]),
            date: ret(content[2]),
            comment: ret(content[3], content[4]),
            fileName: ret(file)
        };

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

    function prepareDate(d) {
        return d
            .replace(/-/g, '')
            .padEnd(8, '0')
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

                let user1 = todo1.user.toLowerCase();
                let user2 = todo2.user.toLowerCase();

                return user2 > user1 ? -1
                    : user2 < user1 ? 1
                        : 0;
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
