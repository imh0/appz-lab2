'use strict';
var fs = require('fs'),
    vm = require('vm');

function cloneInterface(myInterface) {
    function clone(obj, res) {
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                res[key] = {};
                clone(obj[key], res[key]);
            } else {
                res[key] = wrapFunction(key, obj[key]);
            }
        }
    }

    const interfaceClone = {};
    clone(myInterface, interfaceClone);
    return interfaceClone;
}

function wrapFunction(fnName, fn) {
    fs.writeFileSync('file.log', '');
    return function wrapper() {
        var args = [];
        Array.prototype.push.apply(args, arguments);//args.push(arguments);
        console.log('Call function: ' + fnName + '()');
        //console.dir(args);
        if (typeof args[args.length - 1] === 'function') {
            var callBack = args[args.length - 1];
            args[args.length - 1] = function () {
                var cbArgs = [];
                Array.prototype.push.apply(cbArgs, arguments);
                fs.appendFileSync('file.log', 'Call function: ' + fnName + '()\n' + cbArgs.toString() + '\n');
                return callBack.apply(undefined, cbArgs);
            };
        }
        return fn.apply(undefined, args);
    }
}

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
    module: {},
    console: console,
    // Помещаем ссылку на fs API в песочницу
    fs: cloneInterface(fs)
};

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function (err, src) {
    // Запускаем код приложения в песочнице
    var script = vm.createScript(src, fileName);
    script.runInNewContext(sandbox);
});
