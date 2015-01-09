'use strict';

var teep = require('../teep.js');
var validation = teep.validation;

function inc(x) { return 1 + x; }

exports['validation'] = {
  'map': function(test) {
    test.expect(2);
    test.equal(validation.valid(41).map(inc).toString(), 'valid(42)', 'should be 42.');
    test.equal(validation.invalid(['wat']).map(inc).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.done();
  },
  'flatMap': function(test) {
    function incLift(x) { return validation.valid(1 + x); }
    test.expect(2);
    test.equal(validation.valid(41).flatMap(incLift).toString(), 'valid(42)', 'should be 42.');
    test.equal(validation.invalid(['wat']).flatMap(incLift).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.done();
  },
  'ap': function(test) {
    test.expect(4);
    test.equal(validation.valid(inc).ap(validation.valid(41)).toString(), 'valid(42)', 'should be 42.');
    test.equal(validation.valid(inc).ap(validation.invalid(['wat'])).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.equal(validation.invalid(['wat']).ap(validation.valid(41)).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.equal(validation.invalid(['wat']).ap(validation.invalid(['nope'])).toString(), 'invalid(wat,nope)', 'should be invalid(wat).');
    test.done();
  },
};
