'use strict';
 
/**
 * `compose` takes two unary functions `f` and `g`, and combines them into a
 * single unary function `f ∘ g` that applies `g` to an input, passes the
 * output to `f`, applies `f` to it, and returns the result.
 * 
 * The application of `(f ∘ g)(x)` is equivalent to `f(g(x))`.
 *
 */
function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

/**
 * `curry` takes an n-ary function `f` and an optional array of arguments, and
 * returns a curried version of `f`, comprised of *n* nested unary functions
 * where the arity of `f` is *n*.
 *
 * *Example:*
 *
 * ```javascript
 * function add(x, y) {
 *   return x + y;
 * };
 *
 * var add2 = curry(add)(2);
 * var five = add2(3);
 * ```
 *
 * *Example:*
 *
 * ```javascript
 * function mathemagic(x, y, z) {
 *   return x * (y + z);
 * };
 *
 * var fortyTwo = curry(mathemagic)(2)(20)(1);
 * ```
 *
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

module.exports.compose = compose;
module.exports.curry   = curry;
