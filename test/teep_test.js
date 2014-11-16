'use strict';

var teep = require('../lib/teep.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function inc(x) { return 1 + x; }

exports['option'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'option()': function(test) {
    test.expect(2);
    // tests here
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
};

exports['validation'] = {
  'map': function(test) {
    test.expect(2);
    test.equal(teep.valid(41).map(inc).toString(), 'valid(42)', 'should be 42.');
    test.equal(teep.invalid(['wat']).map(inc).toString(), 'invalid(wat)', 'should be invalid(wat).');
    test.done();
  },
};
