'use strict';

var teep = require('../teep.js');
var list = teep.list;

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
    var ys = list();
    for (var j = 0; j < iterations; j++) {
        ys = list(i, ys);
    }
    console.timeEnd('cons');

    console.log('');

    test.done();
  },
   'length': function(test) {
    test.expect(3);

    test.equal(4, list(0, list(1, list())).concat(list(2, list(3, list()))).length);
    test.equal(4, list(0, list(1, list(2, list(3, list())))).length);
    test.equal(0, list().length);

    test.done();
  },
  'toString': function(test) {
    test.expect(3);

    test.equal('cons(0, cons(1, cons(2, cons(3, nil))))',
               list(0, list(1, list())).concat(list(2, list(3, list()))).toString());
    test.equal('cons(0, cons(1, cons(2, cons(3, nil))))',
               list(0, list(1, list(2, list(3, list())))).toString());
    test.equal('nil', list().toString());

    test.done();
  },
  'sharing': function(test) {
    test.expect(2);

    var o1 = { name: 'o1' };
    var o2 = { name: 'o2' };

    var l1 = list(o1, list());
    var l2 = list(o2, l1);

    o1.name = 'oh one';

    test.equal(l1.head.name, 'oh one');
    test.equal(l2.tail.head.name, 'oh one');

    test.done();
  },
  'construction': function(test) {
    test.expect(7);

    var l1 = list();
    var l2 = list('a');
    var l2a = list('a', l1);
    var l3 = list('b', l2);
    var l4 = list('c', l3);
    var l5 = list('d', l4);
    var l6 = list(null, l5);

    test.equal(l1.toString(), 'nil');
    test.equal(l2.toString(), 'cons(a, nil)');
    test.equal(l2a.toString(), 'cons(a, nil)');
    test.equal(l3.toString(), 'cons(b, cons(a, nil))');
    test.equal(l4.toString(), 'cons(c, cons(b, cons(a, nil)))');
    test.equal(l5.toString(), 'cons(d, cons(c, cons(b, cons(a, nil))))');
    test.equal(l6.toString(), 'cons(d, cons(c, cons(b, cons(a, nil))))');

    test.done();
  },
};
