'use strict';
 
/**
 * Curries a function
 *
 * *Example:*
 *
 *     function add(x, y) {
 *       return x + y;
 *     };
 *
 *     var add2 = curry(add)(2);
 *     var five = add2(3);
 *
 * *Example:*
 *
 *     function mathemagic(x, y, z) {
 *       return x * (y + z);
 *     };
 *
 *     var fortyTwo = curry(mathemagic)(2)(20)(1);
 *
 * @param f An n-ary function to curry
 * @return Nested unary functions with depth of `f`'s arity
 */
function curry(f, args) {
    if (!args || !args.length) {
        args = [];
    }
    return function(x) {
        args.push(x);
        if (f.length === args.length) {
            return f.apply(null, args);
        } else {
            return curry(f, args);
        }
    };
}

module.exports.curry = curry;
