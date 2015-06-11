/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';

var edc;
var exports;

(function (edc) {

  var array = {
    contains: function (xs, x) {
      for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) {
          return true;
        }
      }
      return false;
    },
  };

  var fn = {
    compose: function (f, g) {
      return function (x) {
        return f(g(x));
      };
    },
    curry: function (f, args) {
      if (!args || !args.length) {
        args = [];
      }
      return function(x) {
        args.push(x);
        if (f.length === args.length) {
          return f.apply(null, args);
        } else {
          return fn.curry(f, args);
        }
      };
    },
    memoize: function (f, cache) {
      if (!cache) {
        cache = {
          get: function(k)   { return cache[k]; },
          put: function(k,v) { cache[k] = v;    },
        };
      }
      return function () {
        var key = (arguments.length === 0) ?
          arguments[0] : JSON.stringify(arguments);
        var val = cache.get(key);
        if (val === undefined) {
          val = f.apply(undefined, arguments);
          cache.put(key, val);
          return val;
        } else {
          return val;
        }
      };
    },
    lazy: function (f, cache) {
      var fMemo = fn.memoize(f, cache);
      return function() {
        var args = arguments;
        return {
          get: function() { return fMemo.apply(undefined, args); }
        };
      };
    },
  };

  var option = function (value) {
    if (value || value === false || value === 0 || value === '') {
      return {
        empty    : false,
        map      : function(f) { return option(f(value)); },
        flatMap  : function(f) { return f(value); },
        ap       : function(a) { return a.map(value); },
        toString : function()  { return 'some(' + value.toString() + ')'; }
      };
    } else {
      return {
        empty    : true,
        map      : function() { return this; },
        flatMap  : function() { return this; },
        ap       : function() { return this; },
        toString : function() { return 'none()'; }
      };
    }
  };

  var validation = {
    valid: function (value) {
      return {
        valid    : true,
        value    : value,
        map      : function(f) { return validation.valid(f(value)); },
        flatMap  : function(f) { return f(value); },
        ap       : function(a) { return a.map(value); },
        toString : function()  { return 'valid(' + value.toString() + ')'; }
      };
    },
    invalid: function (errors) {
      var self = {
        valid    : false,
        errors   : errors,
        map      : function() { return self; },
        flatMap  : function() { return self; },
        ap       : function(a) {
                     if (a.valid) {
                       return self;
                     } else {
                       return validation.invalid(errors.concat(a.errors));
                     }
                   },
        toString : function() { return 'invalid(' + errors.toString() + ')'; }
      };
      return self;
    },
  };

  var list = function (head, tail) {
    var _nil = {
      length   : 0,
      map      : function() { return this; },
      flatMap  : function() { return this; },
      concat   : function(l) { return l; },
      toString : function() { return 'nil'; }
    };
    var _cons = function (head, tail) {
      return {
        head     : head,
        tail     : tail,
        length   : 1 + tail.length,
        map      : function(f) { return _cons(f(head), tail.map(f)); },
        flatMap  : function(f) { return f(head).concat(tail.flatMap(f)); },
        concat   : function(l) { return _cons(head, tail.concat(l)); },
        toString : function() {
                     return 'cons(' + head + ', ' + tail.toString() + ')';
                   }
      };
    };
    if (tail === undefined || tail === null) {
      return list(head, _nil);
    } else if (head === undefined || head === null) {
      return tail;
    } else {
      return _cons(head, tail);
    }
  };

  var promise = {
    collect: function (promises, callback) {
        var f = fn.curry(callback);
        var p = promises.reduce(function (p1, p2) {
            return p1.then(function (r1) {
                f = f(r1);
                return (p2 instanceof Function) ? p2() : p2;
            });
        });
        return p.then(function (r) { return f(r); });
    }
  };

  var future = function (f) {
    return {
      apply: function (k) {
        return f(k);
      },
      map: function (g) {
        return future (function (k) {
          return f(function (x) {
            return k(g(x));
          });
        });
      },
      flatMap: function (g) {
        return future (function (k) {
          return f(function (x) {
            return g(x).apply(k);
          });
        });
      },
      sequence: function (f2) {
        var xs = [];
        return future(function (k) {
          var kk = function() {
            if (xs.length === 2) {
              k(xs);
            }
          };
          f(function (x) {
            xs.unshift(x);
            kk();
          });
          f2.apply(function (x) {
            xs.push(x);
            kk();
          });
        });
      }
    };
  };

  edc.teep = {
    array: array,
    fn: fn,
    option: option,
    validation: validation,
    list: list,
    promise: promise,
    future: future,
  };

  if (exports) {
    for (var i in edc.teep) {
      if (edc.teep.hasOwnProperty(i)) {
        exports[i] = edc.teep[i];
      }
    }
  }

})(edc || (edc = {}));

