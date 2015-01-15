'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }

var teep = require('../teep.js');
var promise = teep.promise;
var jsc = require('jsverify');

exports.promise = {
  'promise.collect': function (test) {
    jsc.check(jsc.forall(
      'number -> number -> number -> number', 'number', 'number', 'number',
      function (f, x, y, z) {
        var p1 = Promise.resolve(x);
        var p2 = function () {
          return Promise.resolve(y);
        };
        var p3 = Promise.resolve(z);
        var p4 = promise.collect([p1, p2, p3], f);
        return p4.then(function (w) {
          return w === f(x)(y)(z);
        });
      }
    )).then(function (res) {
      test.ok(res === true);
      test.done();
    });
  }
};
