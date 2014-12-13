'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }

var teep = require('../teep.js');

function add(x, y) {
  return x + y;
};

function mathemagic(x, y, z) {
  return x * (y + z);
};

exports['fn'] = {
  'fn.curry': function(test) {
    test.expect(2);

    var add2 = teep.curry(add)(2);
    var five = add2(3);
    test.equal(five, 5);

    var fortyTwo = teep.curry(mathemagic)(2)(20)(1);
    test.equal(fortyTwo, 42);

    test.done();
  },
};
