'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }
var teep = require('../teep.js');

exports.examples = {
  'array.contains': function(test) {
    var contains = teep.array.contains;

    var yep  = contains([1,2,3], 2); // true
    var nope = contains([1,2,3], 4); // false

    test.equal(yep, true);
    test.equal(nope, false);
    test.done();
  },
  'fn.compose': function(test) {
    var compose = teep.fn.compose;

    function inc(x) {
      return x + 1;
    }

    function square(x) {
      return x * x;
    }

    var nine = compose(square, inc)(2); // square(inc(2)) == (2 + 1) ^ 2
    var five = compose(inc, square)(2); // inc(square(2)) == (2 ^ 2) + 1

    test.equal(nine, 9);
    test.equal(five, 5);
    test.done();
  },
  'fn.curry': function(test) {
    var curry = teep.fn.curry;

    function add(x, y) {
      return x + y;
    }

    var add2 = curry(add)(2);
    var five = add2(3); // 2 + 3 == 5

    function mathemagic(x, y, z) {
      return x * (y + z);
    }

    var fortyTwo = curry(mathemagic)(2)(20)(1); // 2 * (20 + 1) == 42

    test.equal(five, 5);
    test.equal(fortyTwo, 42);
    test.done();
  },
  'fn.memoize': function(test) {
    var memoize = teep.fn.memoize;

    function expensiveFn(n) {
      for (var i = 0; i < 10000; i++) {
        for (var j = 0; j < 10000; j++) {
        }
      }
      return n;
    }

    var cheapFn = memoize(expensiveFn);

    var t1 = Date.now();
    var slowResult = cheapFn(42); // expensive computation the first time
    var t2 = Date.now();
    var fastResult = cheapFn(42); // cheap cache lookup the second time
    var t3 = Date.now();

    test.equal(slowResult, 42);
    test.equal(fastResult, 42);

    var slow = t2 - t1;
    var fast = t3 - t2;
    test.ok(slow > 10 * fast); // over 10x faster

    test.done();
  },
  'fn.lazy': function(test) {
    var lazy = teep.fn.lazy;

    function expensiveFn(n) {
      for (var i = 0; i < 10000; i++) {
        for (var j = 0; j < 10000; j++) {
        }
      }
      return n;
    }

    var t1 = Date.now();
    var lazyVal = lazy(expensiveFn)(42); // lazily apply 42 -- no computation yet
    var t2 = Date.now();

    var t3 = Date.now();
    var slowResult = lazyVal.get(); // expensive computation the first time
    var t4 = Date.now();
    var fastResult = lazyVal.get(); // cheap cache lookup the second time
    var t5 = Date.now();

    test.equal(slowResult, 42);
    test.equal(fastResult, 42);

    test.ok(t2 - t1 < 10); // roughly immediate

    var slow = t4 - t3;
    var fast = t5 - t4;
    test.ok(slow > 10 * fast); // over 10x faster

    test.done();
  },
  'promise.collect': function(test) {
    var collect = teep.promise.collect;

    var p = collect([
      Promise.resolve(2),
      Promise.resolve(20),
      Promise.resolve(1)
    ], function (x, y, z) {
      return x * (y + z);
    });

    test.expect(1);
    p.then(function (x) {
      test.equal(x, 42);
      test.done();
    });
  },
};
