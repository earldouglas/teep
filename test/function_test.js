'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }

var teep = require('../teep.js');

function add(x, y) {
  return x + y;
}

function mathemagic(x, y, z) {
  return x * (y + z);
}

function pi(n) {
  var sum = 0;
  for (var k = 0; k < n; k++) {
    sum = sum + Math.pow(-1, k) / (2 * k + 1);
  }
  return 4 * sum;
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

function time(f) {
  var start = (new Date()).getTime();
  var result = f();
  var stop  = (new Date()).getTime();
  return {
    result: result,
    time: (stop - start)
  };
}

exports['fn'] = {
  'compose': function(test) {
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
  'curry': function(test) {
    test.expect(2);

    var add2 = teep.curry(add)(2);
    var five = add2(3);
    test.equal(five, 5);

    var fortyTwo = teep.curry(mathemagic)(2)(20)(1);
    test.equal(fortyTwo, 42);

    test.done();
  },
  'memoize': function(test) {
    test.expect(3);

    var piMemo = teep.memoize(pi);

    var N = 1000000;
    var est1 = time(function() { return piMemo(N); });
    var est2 = time(function() { return piMemo(N); });

    test.equal(round2(est1.result), 3.14);
    test.equal(round2(est2.result), 3.14);
    test.equal((est1.time > (est2.time + 1) * 10), true);

    test.done();
  },
  'lazy': function(test) {
    test.expect(3);

    var N = 1000000;
    var piLazy = teep.lazy(pi)(N);

    var est1 = time(function() { return piLazy.get(); });
    var est2 = time(function() { return piLazy.get(); });

    test.equal(round2(est1.result), 3.14);
    test.equal(round2(est2.result), 3.14);
    test.equal((est1.time > (est2.time + 1) * 10), true);

    test.done();
  },
};
