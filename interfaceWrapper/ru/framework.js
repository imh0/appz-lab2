// Пример оборачивания функции в песочнице

var fs = require('fs'),
vm = require('vm');

function cloneInterface(myInterface) {
  function clone(obj, res) {
    Object.keys(myInterface).forEach((key) => {
      if (typeof obj === 'Object') {
       res[key] = {};
       clone(obj, res[key]);
      } else {
        res[key] = obj[key];
      }
    });
  }
 
  const interfaceClone = {};
  clone(myInterface, interfaceClone);
 
  return interfaceClone;
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Call: ' + fnName);
    console.dir(args);
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
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
