'use strict';

var teep = require('../teep.js');
var valid = teep.validation.valid;
var invalid = teep.validation.invalid;
var jsc = require('jsverify');

exports.validation = {
  'map()': function (test) {
    jsc.assert(jsc.forall('number -> number', 'number', function (f, x) {
      return valid(x).map(f).toString() === valid(f(x)).toString() &&
             invalid(['wat']).map(f).toString() === 'invalid(wat)';
    }));
    test.done();
  },
  'flatMap()': function (test) {
    function liftM0(f) { return function (x) { return valid(f(x)); }; }
    jsc.assert(jsc.forall('number -> number', 'number', function (f, x) {
      return valid(x).flatMap(liftM0(f)).toString() === liftM0(f)(x).toString() &&
             invalid(['wat']).flatMap(liftM0(f)).toString() === 'invalid(wat)';
    }));
    test.done();
  },
  'ap()': function (test) {
    jsc.assert(jsc.forall('number -> number', 'number', function (f, x) {
      return valid(f).ap(valid(x)).toString() === valid(f(x)).toString() &&
             valid(f).ap(invalid(['wat'])).toString() === 'invalid(wat)' &&
             invalid(['wat']).ap(valid(x)).toString() === 'invalid(wat)' &&
             invalid(['wat']).ap(invalid(['nope'])).toString() === 'invalid(wat,nope)';
    }));
    test.done();
  },
};
