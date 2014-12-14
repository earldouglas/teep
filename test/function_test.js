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
  'fn.compose': function(test) {
    test.expect(2);

    function inc(x) {
      return x + 1;
    }

    function square(x) {
      return x * x;
    }

    var nine = teep.compose(square, inc)(2);
    test.equal(nine, 9);

    var five = teep.compose(inc, square)(2);
    test.equal(five, 5);

    test.done();
  },
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
