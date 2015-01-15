'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }

var teep = require('../teep.js');
var fn = teep.fn;
var jsc = require('jsverify');

function time(f) {
  var start = (new Date()).getTime();
  var result = f();
  var stop  = (new Date()).getTime();
  return {
    result: result,
    time: (stop - start)
  };
}

function slow(f) {
  return function () {
    var h = 0;
    for (var i = 0; i < 1000000; i++) {
      h = h + 1;
    }
    return f.apply(null, arguments);
  };
}


exports.fn = {
  'compose': function(test) {
    jsc.assert(jsc.forall(
      'number -> number', 'number -> number', 'number',
      function (f, g, x) {
        return fn.compose(f, g)(x) === f(g(x));
      }
    ));
    test.done();
  },
  'curry': function(test) {
    jsc.assert(jsc.forall(
      'number -> number -> number', 'number', 'number',
      function (f, x, y) {
        var uncurried = function(x, y) { return f(x, y); };
        return fn.curry(uncurried)(x)(y) === f(x, y);
      }
    ));
    test.done();
  },
  'memoize': function(test) {
    jsc.assert(jsc.forall( 'number -> number', 'number', function (f, x) {
      var memoized = fn.memoize(slow(f));
      var y1 = time(function() { return memoized(x); });
      var y2 = time(function() { return memoized(x); });
      return f(x) === y1.result && f(x) === y2.result && y1.time > y2.time;
    }));
    test.done();
  },
  'lazy': function(test) {
    jsc.assert(jsc.forall( 'number -> number', 'number', function (f, x) {
      var lazied = fn.lazy(slow(f))(x);
      var y1 = time(function() { return lazied.get(); });
      var y2 = time(function() { return lazied.get(); });
      return f(x) === y1.result && f(x) === y2.result && y1.time > y2.time;
    }));
    test.done();
  },
};
