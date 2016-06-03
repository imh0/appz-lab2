"use strict";

console.log('From application!\n');

var fileName = './README.md';
console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
	console.log('File ' + fileName + ' size ' + src.length);
});

fs.writeFile('text.txt', 'Hello World', function (err) {
    if (err) {
        return console.log(err);
    }
});

fs.readFile('text.txt', function(err) {
    if (err) {
        return console.log(err);
    }
});
