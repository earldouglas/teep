'use strict';

var teep = require('../teep.js');
var future = teep.future;
var jsc = require('jsverify');

var async = function(x) {
  return function (k) {
    k(x);
  };
};

var asyncF = function (f) {
  return function (x) {
    return future(function (k) {
      k(f(x));
    });
  };
};

exports.future = {
  'future.apply': function (test) {
    jsc.check(jsc.forall('number',
      function (x) {
        var verify = function (z) {
          if (x === z) {
            test.done();
          }
        };
        future(async(x)).apply(verify);
      }
    ));
  },
  'future.map': function (test) {
    jsc.check(jsc.forall('number', 'number -> number',
      function (x, f) {
        var verify = function (z) {
          if (f(x) === z) {
            test.done();
          }
        };
        future(async(x)).map(f).apply(verify);
      }
    ));
  },
  'future.flatMap': function (test) {
    jsc.check(jsc.forall('number', 'number -> number',
      function (x, f) {
        var verify = function (z) {
          if (f(x) === z) {
            test.done();
          }
        };
        future(async(x)).flatMap(asyncF(f)).apply(verify);
      }
    ));
  },
  'future.sequence': function (test) {
    jsc.check(jsc.forall('number',
      function (x) {
        var verify = function (z) {
          if (z.length === 2 && z[0] === x && z[1] === x) {
            test.done();
          }
        };
        future(async(x)).sequence(future(async(x))).apply(verify);
      }
    ));
  },
};
