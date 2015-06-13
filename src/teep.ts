/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

var exports;

module edc {

  var array = {
    contains: <A>(xs: Array<A>, x: A): boolean => {
      for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) {
          return true;
        }
      }
      return false;
    },
  };

  export interface Cache<A,B> {
    get: (A) => B;
    put: (A, B) => void;
  }

  class DumbCache<A,B> implements Cache<A,B> {
    cache = {};
    get = (k) => { return this.cache[k]; };
    put = (k,v) => { this.cache[k] = v; };
  }

  export interface Lazy<A> {
    get: () => A;
  }

  var fn = {
    compose: <A,B,C>(f: (B) => C, g: (A) => B): (A) => C => {
      return (x: A): C => {
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
    memoize: <A,B> (f: (A) => B, cache: Cache<A,B>): (A) => B => {
      cache = cache || new DumbCache();
      return (x: A): B => {
        var val = cache.get(x);
        if (val === undefined) {
          val = f(x);
          cache.put(x, val);
          return val;
        } else {
          return val;
        }
      };
    },
    lazy: <A,B>(f: (A) => B, cache: Cache<A,B>): (A) => Lazy<B> => {
      var fMemo = fn.memoize(f, cache);
      return (x: A) => {
        return {
          get: () => { return fMemo(x); }
        };
      };
    },
  };

  export interface Option<A> {
    empty    : boolean;
    map      : <B>(f: (A) => B) => Option<B>;
    flatMap  : <B>(f: (A) => Option<B>) => Option<B>;
    ap       : <B>(x: Option<(A) => B>) => Option<B>;
  }

  class Some<A> implements Option<A> {
    value: A;
    constructor(value: A) {
      this.value = value;
    }
    empty    = false;
    map      = (f) => { return option(f(this.value)); };
    flatMap  = (f) => { return f(this.value); };
    ap       = <B>(x: Option<(A) => B>) => { return x.map((f) => f(this.value)); };
    toString = () => { return 'some(' + this.value.toString() + ')'; };
  }

  class None<A> implements Option<A> {
    empty    = true;
    map      = () => { return this; };
    flatMap  = () => { return this; };
    ap       = () => { return this; };
    toString = () => { return 'none()'; };
  }
 
  var _none = new None();

  var option = <A>(value: A): Option<A> => {
    if (value !== null && typeof value !== 'undefined') {
      return new Some(value);
    } else {
      return _none;
    }
  }

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
    collect: function (promises, k) {
      var f = fn.curry(k, null);
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
            xs[0] = x;
            kk();
          });
          f2.apply(function (x) {
            xs[1] = x;
            kk();
          });
        });
      }
    };
  };

  export var teep = {
    array: array,
    fn: fn,
    option: option,
    validation: validation,
    list: list,
    promise: promise,
    future: future,
  };

  var setExports = function () {
    for (var i in teep) {
      var setExport = function () {
        exports[i] = teep[i];
      };
      !teep.hasOwnProperty(i) || setExport();
    }
  }

  !exports || setExports();

}

