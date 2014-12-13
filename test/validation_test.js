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
};
