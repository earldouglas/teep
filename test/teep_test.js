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
  'constructor: no args': function(test) {
    test.expect(2);
    // tests here
    test.equal(teep.option().empty, true, 'should be empty.');
    test.equal(teep.option().toString(), 'none()', 'should be none().');
    test.done();
  },
  'constructor: one arg': function(test) {
    test.expect(2);
    // tests here
    test.equal(teep.option(42).empty, false, 'should not be empty.');
    test.equal(teep.option(42).toString(), 'some(42)', 'should be some(42).');
    test.done();
  },
  'map': function(test) {
    test.expect(2);
    // tests here
    test.equal(teep.option().map(inc).toString(), 'none()', 'should be empty.');
    test.equal(teep.option(41).map(inc).toString(), 'some(42)', 'should be 42.');
    test.done();
  },
};
