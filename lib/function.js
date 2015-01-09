'use strict';

function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

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
