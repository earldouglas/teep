'use strict';
 
var curry = require('./function').curry;

/**
 * Given an array of promises and a callback, passes the result of each promise
 * (in order) as an argument to the callback, and returns a single promise that
 * yields the result of the callback.
 *
 * Any of the promises can be 'lazy', implemented as a nullary function that 
 * returns a promise, and will be retrieved as late as possible.
 *
 * *Example:*
 *
 * ```javascript
 * var p = collect([
 *   Promise.resolve(2),
 *   Promise.resolve(20),
 *   Promise.resolve(1)
 * ], function (x, y, z) {
 *   return x * (y + z);
 * });
 * ```
 *
 * p is congruent to `Promise.resolve(2 * (20 + 1))`, or `Promise.resolve(42)`
 *
 * @param promises {array} an array of promises
 * @param callback {function} a function that takes as arguments the results of
                              the promises
 *
 */
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
