'use strict';

var teep = require('../teep.js');
var array = teep.array;
var jsc = require('jsverify');

exports.array = {
  'contains': function(test) {
    jsc.assert(jsc.forall('array number', 'number', function (xs, x) {
      var inXs = false;
      xs.forEach(function (x0) { inXs = inXs || x === x0; });

      var ys = xs.concat(x);
      var inYs = false;
      ys.forEach(function (y0) { inYs = inYs || x === y0; });
      return array.contains(xs, x) === inXs &&
             array.contains(ys, x);
    }));
    test.done();
  },
};
