'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }

var assert = require("assert")
var teep = require('../teep.js');

describe('examples', function () {

  var times =
    function (x) {
      return function (y) {
        return x * y;
      };
    };

  describe('array', function () {
    it('contains', function () {
      var yep  = teep.array.contains([1,2,3], 2); // true
      var nope = teep.array.contains([1,2,3], 4); // false
      assert.equal(yep, true);
      assert.equal(nope, false);
    });
  });

  describe('fn', function () {
    it('compose', function () {
      function inc(x) {
        return x + 1;
      }

      function square(x) {
        return x * x;
      }

      var nine = teep.fn.compose(square, inc)(2); // square(inc(2)) == (2 + 1) ^ 2
      var five = teep.fn.compose(inc, square)(2); // inc(square(2)) == (2 ^ 2) + 1
      assert.equal(nine, 9);
      assert.equal(five, 5);
    });
  });

  describe('fn', function () {
    it('curry', function () {
      function add(x, y) {
        return x + y;
      }

      var add2 = teep.fn.curry(add)(2);
      var five = add2(3); // 2 + 3 == 5

      function mathemagic(x, y, z) {
        return x * (y + z);
      }

      var fortyTwo = teep.fn.curry(mathemagic)(2)(20)(1); // 2 * (20 + 1) == 42

      assert.equal(five, 5);
      assert.equal(fortyTwo, 42);
    });
  });

  describe('fn', function () {
    it('memoize', function () {
      function expensiveFn(n) {
        for (var i = 0; i < 10000; i++) {
          for (var j = 0; j < 10000; j++) {
            i = i;
          }
        }
        return n;
      }

      var cheapFn = teep.fn.memoize(expensiveFn);

      var t1 = Date.now();
      var slowResult = cheapFn(42); // expensive computation the first time
      var t2 = Date.now();
      var fastResult = cheapFn(42); // cheap cache lookup the second time
      var t3 = Date.now();

      assert.equal(slowResult, 42);
      assert.equal(fastResult, 42);

      var slow = t2 - t1;
      var fast = t3 - t2;
      assert.ok(slow > 10 * fast); // over 10x faster
    });

    it('lazy', function () {
      function expensiveFn(n) {
        for (var i = 0; i < 10000; i++) {
          for (var j = 0; j < 10000; j++) {
            i = i;
          }
        }
        return n;
      }
  
      var t1 = Date.now();
      var lazyVal = teep.fn.lazy(expensiveFn)(42); // lazily apply 42 -- no computation yet
      var t2 = Date.now();
  
      var t3 = Date.now();
      var slowResult = lazyVal.get(); // expensive computation the first time
      var t4 = Date.now();
      var fastResult = lazyVal.get(); // cheap cache lookup the second time
      var t5 = Date.now();
  
      assert.equal(slowResult, 42);
      assert.equal(fastResult, 42);
  
      assert.ok(t2 - t1 < 10); // roughly immediate
  
      var slow = t4 - t3;
      var fast = t5 - t4;
      assert.ok(slow > 10 * fast); // over 10x faster
    });
  });

  describe('option', function () {
    var maybe42 = function (x) {
      if (x === 42) {
        return teep.option(x);
      } else {
        return teep.option();
      }
    };

    it('constructor', function () {
      assert(teep.option().empty);
      assert(teep.option(null).empty);
      assert(teep.option(undefined).empty);
      assert(teep.option(42).empty === false);
    });

    it('map', function () {
      assert.equal('none()', teep.option().map(times(2)).toString());
      assert.equal('some(42)', teep.option(21).map(times(2)).toString());
    });

    it('flatMap', function () {
      assert.equal('none()', teep.option().flatMap(maybe42).toString());
      assert.equal('none()', teep.option(41).flatMap(maybe42).toString());
      assert.equal('some(42)', teep.option(42).flatMap(maybe42).toString());
    });

    it('ap', function () {
      assert.equal('none()', teep.option().ap(teep.option()).toString());
      assert.equal('none()', teep.option().ap(teep.option(times(2))).toString());
      assert.equal('none()', teep.option(21).ap(teep.option()).toString());
      assert.equal('some(42)', teep.option(21).ap(teep.option(times(2))).toString());
    });
  });

  describe('promise', function () {
    it('collect', function (done) {
      var p = teep.promise.collect([
        Promise.resolve(2),
        function () { return Promise.resolve(20); },
        Promise.resolve(1)
      ], function (x, y, z) {
        return x * (y + z);
      });
  
      p.then(function (x) {
        assert.equal(x, 42);
        done();
      });
    });
  });

  describe('validation', function () {
    it('map', function () {
      assert.equal('valid(42)', teep.validation.valid(21).map(times(2)).toString());
      assert.equal('valid(42)', teep.validation.valid(times(2)(21)).toString());
      assert.equal('invalid(wat)', teep.validation.invalid(['wat']).map(times(2)).toString());
    });

    it('flatMap', function () {
      function liftM0(f) { return function (x) { return teep.validation.valid(f(x)); }; }
      assert.equal('valid(42)', teep.validation.valid(21).flatMap(liftM0(times(2))).toString());
      assert.equal('invalid(wat)', teep.validation.invalid(['wat']).flatMap(liftM0(times(2))).toString());
    });

    it('ap', function () {
      assert.equal('valid(42)', teep.validation.valid(times(2)).ap(teep.validation.valid(21)).toString());
      assert.equal('invalid(wat)', teep.validation.invalid(['wat']).ap(teep.validation.valid(21)).toString());
      assert.equal('invalid(wat)', teep.validation.valid(times(2)).ap(teep.validation.invalid(['wat'])).toString());
      assert.equal('invalid(wat,lol)', teep.validation.invalid(['wat']).ap(teep.validation.invalid(['lol'])).toString());
    });
  });

  describe('list', function() {
    var list = teep.list;

    it('length', function () {
      assert.equal(4, list(0, list(1, list())).concat(list(2, list(3, list()))).length);
      assert.equal(4, list(0, list(1, list(2, list(3, list())))).length);
      assert.equal(0, list().length);
    });

    it('toString', function () {
      assert.equal('cons(0, cons(1, cons(2, cons(3, nil))))',
                 list(0, list(1, list())).concat(list(2, list(3, list()))).toString());
      assert.equal('cons(0, cons(1, cons(2, cons(3, nil))))',
                 list(0, list(1, list(2, list(3, list())))).toString());
      assert.equal('nil', list().toString());
    });

    it('sharing', function () {
      var o1 = { name: 'o1' };
      var o2 = { name: 'o2' };

      var l1 = list(o1, list());
      var l2 = list(o2, l1);

      o1.name = 'oh one';

      assert.equal(l1.head.name, 'oh one');
      assert.equal(l2.tail.head.name, 'oh one');
    });

    it('construction', function () {
      var l1 = list();
      var l2 = list('a');
      var l3 = list('b', l2);
      var l4 = list(null, l3);

      assert.equal(l1.toString(), 'nil');
      assert.equal(l2.toString(), 'cons(a, nil)');
      assert.equal(l3.toString(), 'cons(b, cons(a, nil))');
      assert.equal(l4.toString(), 'cons(b, cons(a, nil))');
    });

    it('map', function () {
      function square(x) {
        return x * x;
      }

      var l = list(3, list(2, list())).map(square); // cons(9, cons(4, nil))

      assert.equal('cons(9, cons(4, nil))', l.toString());
    });

    it('flatMap', function () {
      function squareAndRepeat(x) {
        var s = x * x;
        return list(s, list(s));
      }

      var l1 = list();
      var l2 = list(2);
      var l3 = list(3, l2);

      var l1s = l1.flatMap(squareAndRepeat);
      var l2s = l2.flatMap(squareAndRepeat);
      var l3s = l3.flatMap(squareAndRepeat);

      assert.equal(l1s.toString(), 'nil');
      assert.equal(l2s.toString(), 'cons(4, cons(4, nil))');
      assert.equal(l3s.toString(), 'cons(9, cons(9, cons(4, cons(4, nil))))');
    });

  });

  describe('reader', function () {

    var times = function (x) {
      return function (y) {
        return x * y;
      };
    };

    it('apply', function () {
      assert.equal(42, teep.reader(times(7)).apply(6));
    });

    it('map', function () {
      assert.equal(42, teep.reader(times(2)).map(times(3)).apply(7));
    });

    it('flatMap', function () {
      assert.equal(72, teep.reader(times(2)).flatMap(function (x) {
        return teep.reader(times(x));
      }).apply(6));
    });

    it('read', function () {
      var getX = teep.read.map(function (e) { return e.x; });
      var getY = teep.read.map(function (e) { return e.y; });
      var e = { x: 6, y: 7, };
      assert.equal(42,
        getX.flatMap(function (x) {
          return getY.map(function (y) {
            return x * y;
          });
        }).apply(e)
      );
    });

  });

  describe('future', function () {
    var async = function(x) {
      return function (k) {
        return k(x);
      };
    };
    
    var asyncF = function (f) {
      return function (x) {
        return teep.future(function (k) {
          return k(f(x));
        });
      };
    };
    
    var verify = function (done) {
      return function (y) {
        if (42 === y) {
          done();
        }
      };
    };

    it('apply', function (done) {
      teep.future(async(42)).apply(verify(done));
    });

    it('map', function (done) {
      teep.future(async(21)).map(times(2)).apply(verify(done));
    });

    it('flatMap', function (done) {
      teep.future(async(21)).flatMap(asyncF(times(2))).apply(verify(done));
    });

    it('sequence', function (done) {
      var verify = function (a) {
        return function (b) {
          if (42 === a && 43 === b) {
            done();
          }
        };
      };
      teep.future(async(42)).sequence(teep.future(async(43))).apply(verify);
    });

  });

  describe('readerT', function () {

    var db = {
      answer: 42,
    };

    var getAnswer = function (db) {
      return teep.future(function (k) {
        return k(db.answer);
      });
    };

    function addToAnswer(x) {
      return teep.readerT(function (db) {
        return teep.future(function (k) {
          return k(db.answer + x);
        });
      });
    };

    function verify(x, done) {
      return function (y) {
        if (x === y) {
          done();
        }
      };
    };

    it('apply', function (done) {
      teep.readerT(getAnswer).apply(db).apply(verify(42, done));
    });

    it('map', function (done) {
      teep.readerT(getAnswer).map(function (x) {
        return x + 1;
      }).apply(db).apply(verify(43, done));
    });

    it('flatMap', function (done) {
      teep.readerT(getAnswer).flatMap(function (x) {
        return addToAnswer(x + 1);
      }).apply(db).apply(verify(85, done));
    });

  });

});
