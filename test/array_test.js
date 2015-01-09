'use strict';

var teep = require('../teep.js');
var array = teep.array;

exports['array'] = {
  'contains': function(test) {
    test.expect(5);

    test.equal(array.contains([1,2,3], 0), false);
    test.equal(array.contains([1,2,3], 1), true);
    test.equal(array.contains([1,2,3], 2), true);
    test.equal(array.contains([1,2,3], 3), true);
    test.equal(array.contains([1,2,3], 4), false);

    test.done();
  },
};
