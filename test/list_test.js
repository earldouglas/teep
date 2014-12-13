'use strict';

var teep = require('../lib/teep.js');
var cons = teep.cons;
var nil  = teep.nil;

exports['list'] = {
  'perf': function(test) {
    test.expect(0);

    var iterations = 1000000;

    console.log('');

    console.time('push');
    var xs = [];
    for (var i = 0; i < iterations; i++) {
        xs.push(i);
    }
    console.timeEnd('push');

    console.time('cons');
    var ys = nil;
    for (var j = 0; j < iterations; j++) {
        ys = cons(i, ys);
    }
    console.timeEnd('cons');

    console.log('');

    test.done();
  },
   'length': function(test) {
    test.expect(3);

    test.equal(4, cons(0, cons(1, nil)).concat(cons(2, cons(3, nil))).length);
    test.equal(4, cons(0, cons(1, cons(2, cons(3, nil)))).length);
    test.equal(0, nil.length);

    test.done();
  },
  'toString': function(test) {
    test.expect(3);

    test.equal('cons(0, cons(1, cons(2, cons(3, nil))))',
               cons(0, cons(1, nil)).concat(cons(2, cons(3, nil))).toString());
    test.equal('cons(0, cons(1, cons(2, cons(3, nil))))',
               cons(0, cons(1, cons(2, cons(3, nil)))).toString());
    test.equal('nil', nil.toString());

    test.done();
  },
  'sharing': function(test) {
    test.expect(2);

    var o1 = { name: 'o1' };
    var o2 = { name: 'o2' };

    var l1 = cons(o1, nil);
    var l2 = cons(o2, l1);

    o1.name = 'oh one';

    test.equal(l1.head.name, 'oh one');
    test.equal(l2.tail.head.name, 'oh one');

    test.done();
  },
};
