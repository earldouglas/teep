'use strict';

var teep = require('../teep.js');

function inc(x) { return 1 + x; }

exports['option'] = {
  'option()': function(test) {
    test.expect(2);
    test.equal(teep.option().empty, true, 'should be empty.');
    test.equal(teep.option().toString(), 'none()', 'should be none().');
    test.done();
  },
  'option(42)': function(test) {
    test.expect(2);
    test.equal(teep.option(42).empty, false, 'should not be empty.');
    test.equal(teep.option(42).toString(), 'some(42)', 'should be some(42).');
    test.done();
  },
  'option(false)': function(test) {
    test.expect(1);
    test.equal(teep.option(false).toString(), 'some(false)', 'should not be empty.');
    test.done();
  },
  'option(null)': function(test) {
    test.expect(1);
    test.equal(teep.option(null).toString(), 'none()', 'should be empty.');
    test.done();
  },
  'map': function(test) {
    test.expect(2);
    test.equal(teep.option().map(inc).toString(), 'none()', 'should be empty.');
    test.equal(teep.option(41).map(inc).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
  'flatMap': function(test) {
    function incLift(x) { return teep.option(1 + x); }
    test.expect(2);
    test.equal(teep.option().flatMap(incLift).toString(), 'none()', 'should be empty.');
    test.equal(teep.option(41).flatMap(incLift).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
  'ap': function(test) {
    test.expect(2);
    test.equal(teep.option().ap(teep.option(41)).toString(), 'none()', 'should be empty.');
    test.equal(teep.option(inc).ap(teep.option(41)).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
};
