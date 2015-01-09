'use strict';

var teep = require('../teep.js');
var option = teep.option;

function inc(x) { return 1 + x; }

exports['option'] = {
  'option()': function(test) {
    test.expect(2);
    test.equal(option().empty, true, 'should be empty.');
    test.equal(option().toString(), 'none()', 'should be none().');
    test.done();
  },
  'option(42)': function(test) {
    test.expect(2);
    test.equal(option(42).empty, false, 'should not be empty.');
    test.equal(option(42).toString(), 'some(42)', 'should be some(42).');
    test.done();
  },
  'option(false)': function(test) {
    test.expect(1);
    test.equal(option(false).toString(), 'some(false)', 'should not be empty.');
    test.done();
  },
  'option(null)': function(test) {
    test.expect(1);
    test.equal(option(null).toString(), 'none()', 'should be empty.');
    test.done();
  },
  'map': function(test) {
    test.expect(2);
    test.equal(option().map(inc).toString(), 'none()', 'should be empty.');
    test.equal(option(41).map(inc).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
  'flatMap': function(test) {
    function incLift(x) { return option(1 + x); }
    test.expect(2);
    test.equal(option().flatMap(incLift).toString(), 'none()', 'should be empty.');
    test.equal(option(41).flatMap(incLift).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
  'ap': function(test) {
    test.expect(2);
    test.equal(option().ap(option(41)).toString(), 'none()', 'should be empty.');
    test.equal(option(inc).ap(option(41)).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
};
