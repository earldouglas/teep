'use strict';

/**
 * `compose` takes two unary functions `f` and `g`, and combines them into a
 * single unary function `f ∘ g` that applies `g` to an input, passes the
 * output to `f`, applies `f` to it, and returns the result.
 *
 * The application of `(f ∘ g)(x)` is equivalent to `f(g(x))`.
 *
 * *Example:*
 *
 * function inc(x) {
 *   return x + 1;
 * }
 *
 * function square(x) {
 *   return x * x;
 * }
 *
 * var nine = compose(square, inc)(2); // square(inc(2)) == (2 + 1) ^ 2
 * var five = compose(inc, square)(2); // inc(square(2)) == (2 ^ 2) + 1
 *
 * @param f {function} a unary function
 * @param g {function} a unary function
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
 * @param f {function} an n-ary function
 * @param args {array} [optional] arguments to apply to `f`
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

function dumbCache() {
  var cache = {};
  return {
    get: function(k)   { return cache[k]; },
    put: function(k,v) { cache[k] = v;    },
  };
}

/**
 * `memoize` takes a function and an optional cache implementation, and
 * memoizes the function by backing it with the cache, if supplied, or a simple
 * object-based cache otherwise.
 *
 * *Example:*
 *
 * ```javascript
 * function expensiveFn(n) { ... }
 *
 * var cheapFn = memoize(expensiveFn);
 *
 * var slowResult = cheapFn(42); // expensive computation the first time
 * var fastResult = cheapFn(42); // cheap cache lookup the second time
 * ```
 *
 * @param f {function} an n-ary function
 * @param cache {object} [optional] a cache object with get(k) and put(k,v) functions
 *
 */
function memoize(f, cache) {
  if (!cache) {
    cache = dumbCache();
  }
  return function () {
    var key = (arguments.length === 0) ? arguments[0] : JSON.stringify(arguments);
    var val = cache.get(key);
    if (val === undefined) {
      val = f.apply(undefined, arguments);
      cache.put(key, val);
      return val;
    } else {
      return val;
    }
  };
}

/**
 * `lazy` takes a function and an optional cache implementation, and creates a
 * function that, given input arguments, returns a lazy evaluator that will
 * apply the function to the arguments only when needed, and only once if
 * needed many times.
 *
 * *Example:*
 *
 * ```javascript
 * function expensiveFn(n) { ... }
 *
 * var lazyVal = lazy(expensiveFn)(42); // lazily apply 42 -- no computation yet
 *
 * var slowResult = lazyVal.get(); // expensive computation the first time
 * var fastResult = lazyVal.get(); // cheap cache lookup the second time
 * ```
 *
 * @param f {function} an n-ary function
 * @param cache {object} [optional] a cache object with get(k) and put(k,v) functions
 *
 */
function lazy(f, cache) {
  var fMemo = memoize(f, cache);
  return function() {
    var args = arguments;
    return {
      get: function() { return fMemo.apply(undefined, args); }
    };
  };
}

module.exports.compose = compose;
module.exports.curry   = curry;
module.exports.memoize = memoize;
module.exports.lazy    = lazy;
