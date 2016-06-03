'use strict';

const fs = require('fs');
const vm = require('vm');
let fileName = './application.js';

if (process.argv[2] !== undefined) {
  fileName = process.argv[2];
}

var fileLog = 'file.log';

function writeToFile(message) {
   fs.appendFile(fileLog, message + '\n', function (err) {
      if (err) {
         return console.log(err);
      }
   });
}

function createFile() {
   fs.writeFile(fileLog, '', function (err) {
      if (err) {
         return console.log(err);
      }
   });
}

const context = {
   module: {},
   console: {
      log: function (message) {
         var date = new Date();
         var text = fileName + ' ' + date.toUTCString() + ' ' + message;
         console.log(text);
         writeToFile(text);
      }
   },
   setInterval: setInterval,
   setTimeout: setTimeout,
   require: function (module) {
      var date = new Date();
      var text = date.toUTCString() + ' ' + module + '\n';
      writeToFile(text);
      return require(module);
   }
};

context.global = context;
const sandbox = vm.createContext(context);

function printHashParams(hash) {
  Object.keys(hash).forEach(function (item) {
    if (typeof hash[item] === 'object') {
       printHashParams(hash[item]);
    } else {
      console.log(typeof hash[item] + ' : ' + hash[item]);
    }
  });
 }

 function printFunction(func) {
   console.log(func.toString());
   console.log(func.length);
 }

fs.readFile(fileName, (err, src) => {
   if (err) {
      return console.log(err);
   }

   createFile();

   var script = vm.createScript(src, fileName);
   script.runInNewContext(sandbox);

   printHashParams(sandbox.module.exports);
   printFunction(sandbox.module.exports);
});