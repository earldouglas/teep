'use strict';

var teep = require('../teep.js');

function inc(x) { return 1 + x; }

exports['validation'] = {
  'map': function(test) {
    test.expect(2);
    test.equal(teep.valid(41).map(inc).toString(), 'valid(42)', 'should be 42.');
    test.equal(teep.invalid(['wat']).map(inc).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.done();
  },
  'flatMap': function(test) {
    function incLift(x) { return teep.valid(1 + x); }
    test.expect(2);
    test.equal(teep.valid(41).flatMap(incLift).toString(), 'valid(42)', 'should be 42.');
    test.equal(teep.invalid(['wat']).flatMap(incLift).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.done();
  },
  'ap': function(test) {
    test.expect(4);
    test.equal(teep.valid(inc).ap(teep.valid(41)).toString(), 'valid(42)', 'should be 42.');
    test.equal(teep.valid(inc).ap(teep.invalid(['wat'])).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.equal(teep.invalid(['wat']).ap(teep.valid(41)).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.equal(teep.invalid(['wat']).ap(teep.invalid(['nope'])).toString(), 'invalid(wat,nope)', 'should be invalid(wat).');
    test.done();
  },
};
