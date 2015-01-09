'use strict';

if (!global.Promise) { global.Promise = require('bluebird'); }

var teep = require('../teep.js');
var promise = teep.promise;

exports['promise'] = {
  'promise.collect': function(test) {
    test.expect(1);
    var p1 = Promise.resolve(2);
    var p2 = function () { return Promise.resolve(20); };
    var p3 = Promise.resolve(1);
    var f  = function (x, y, z) { return x * (y + z); };
    var p  = promise.collect([p1, p2, p3], f);
    p.then(function (x) {
        test.equal(x, 42);
    }).then(function () {
        test.done();
    });
  },
};
