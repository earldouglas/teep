'use strict';

var teep = require('../teep.js');
var option = teep.option;
var jsc = require('jsverify');

function get(x) {
  var y = null;
  x.map(function (z) { y = z; });
  return y;
}

exports.option = {
  'option()': function (test) {
    test.strictEqual(get(option()), null);
    test.done();
  },
  'option(<falsy>)': function (test) {
    jsc.assert(jsc.forall('falsy', function (x) {
      var o = option(x);
      var y = get(o);
      return o.empty || y === false || y === 0 || y === '';
    }));
    test.done();
  },
  'option(<value>)': function (test) {
    test.strictEqual(get(option()), null);
    jsc.assert(jsc.forall('value', function (x) {
      return get(option(x)) === x;
    }));
    test.done();
  },
  'toString()': function (test) {
    jsc.assert(jsc.forall('number', function (x) {
      return option().toString() === 'none()' &&
             option(x).toString() === 'some(' + x + ')';
    }));
    test.done();
  },
  'map()': function (test) {
    jsc.assert(jsc.forall('number -> number', 'number', function (f, x) {
      return option().map(f).toString() === 'none()' &&
             get(option(x).map(f)) === get(option(f(x)));
    }));
    test.done();
  },
  'flatMap()': function (test) {
    function liftM0(f) { return function (x) { return option(f(x)); }; }
    jsc.assert(jsc.forall('number -> number', 'number', function (f, x) {
      return option().flatMap(liftM0(f)).toString() === 'none()' &&
             get(option(x).flatMap(liftM0(f))) === get(liftM0(f)(x));
    }));
    test.done();
  },
  'ap()': function (test) {
    jsc.assert(jsc.forall('number -> number', 'number', function (f, x) {
      return option().ap(option(x)).toString() === 'none()' &&
             get(option(f).ap(option(x))) === f(x);
    }));
    test.done();
  },
};
