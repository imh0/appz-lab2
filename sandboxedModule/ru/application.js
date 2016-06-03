'use strict';

var util = require('util');

setTimeout(() => {
  console.log('Message');
}, 1000);

setInterval(() => {
  console.log('Interval');
}, 3000);

module.exports = function(a, b, c) {
  console.log('From application exported function');
};
