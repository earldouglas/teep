'use strict';
 
var curry = require('./function').curry;

function collect(promises, callback) {
    var f = curry(callback);
    var p = promises.reduce(function (p1, p2) {
        return p1.then(function (r1) {
            f = f(r1);
            return (p2 instanceof Function) ? p2() : p2;
        });
    });
    return p.then(function (r) { return f(r); });
}

module.exports.collect = collect;
