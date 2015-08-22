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

  class DumbCache<A,B> {
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

  export interface Monad<A> {
    map: <B>(f: (A) => B) => Monad<B>;
    flatMap: <B>(f: (A) => Monad<B>) => Monad<B>;
  }

  export interface Option<A> extends Monad<A> {
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

  export interface Validation<A> extends Monad<A> {
    valid    : boolean;
    map      : <B>(f: (A) => B) => Validation<B>;
    flatMap  : <B>(f: (A) => Validation<B>) => Validation<B>;
    ap       : <B>(x: Validation<(A) => B>) => Validation<B>;
  }

  class Valid<A> implements Validation<A> {
    value: A;
    constructor(value: A) {
      this.value = value;
    }
    valid    = true;
    map      = (f) => { return validation.valid(f(this.value)); };
    flatMap  = (f) => { return f(this.value); };
    ap       = (a) => { return a.map(this.value); };
    toString = () => { return 'valid(' + this.value.toString() + ')'; };
  }

  class Invalid<A> implements Validation<A> {
    errors: Array<String>;
    constructor(errors: Array<String>) {
      this.errors = errors;
    }
    valid    = false;
    map      = (f) => { return this; };
    flatMap  = (f) => { return this; };
    ap       = (a) => { return a.valid ? this : validation.invalid(this.errors.concat(a.errors)); };
    toString = () => { return 'invalid(' + this.errors.toString() + ')'; };
  }

  var validation = {
    valid: <A>(value: A) => { return new Valid(value); },
    invalid: (errors: Array<String>) => { return new Invalid(errors); },
  };

  export interface List<A> extends Monad<A> {
    length   : number;
    map      : <B>(f: (A) => B) => List<B>;
    flatMap  : <B>(f: (A) => List<B>) => List<B>;
    concat   : (l: List<A>) => List<A>;
  }

  class Nil<A> implements List<A> {
    length   = 0;
    map      = () => { return this; };
    flatMap  = () => { return this; };
    concat   = (l) => { return l; };
    toString = () => { return 'nil'; };
  }

  class Cons<A> implements List<A> {
    head: A;
    tail: List<A>;
    length: number;
    constructor(head: A, tail: List<A>) {
      this.head = head;
      this.tail = tail;
      this.length = 1 + this.tail.length;
    }
    map      = (f) => { return new Cons(f(this.head), this.tail.map(f)); };
    flatMap  = (f) => { return f(this.head).concat(this.tail.flatMap(f)); };
    concat   = (l) => { return new Cons(this.head, this.tail.concat(l)); };
    toString = () => { return 'cons(' + this.head + ', ' + this.tail.toString() + ')'; };
  }

  var _nil = new Nil();

  var list = <A>(head: A, tail: List<A>) => {
    if (tail === undefined || tail === null) {
      return list(head, _nil);
    } else if (head === undefined || head === null) {
      return tail;
    } else {
      return new Cons(head, tail);
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

  class Reader<A,B> {
    f: (A) => B;
    constructor(f: (A) => B) {
      this.f = f;
    }
    apply(a: A): B {
      return this.f(a);
    };
    map<C>(g: (B) => C): Reader<A,C> {
      return new Reader((a) => {
        return g(this.f(a));
      });
    };
    flatMap<C>(g: (B) => Reader<A,C>): Reader<A,C> {
      return new Reader((a) => {
        return g(this.f(a)).apply(a);
      });
    };
  }

  var reader = <A,B>(f: (A) => B) => { return new Reader(f); }

  class Future<A> {
    f: (k: (A) => any) => any;
    constructor(f) {
      this.f = f;
    }
    apply(k: (A) => any): void {
      this.f(k);
    };
    map<B>(g: (A) => B): Future<B> {
      return new Future((k: (B) => any) => {
        return this.f((a: A) => {
          k(g(a));
        });
      });
    };
    flatMap<B>(g: (A) => Future<B>): Future<B> {
      return new Future((k: (B) => any) => {
        return this.f((a: A) => {
          g(a).apply(k);
        });
      });
    };
    sequence<B>(f2: Future<B>): Future<(A) => B> {
      var a: A;
      var b: B;
      return new Future((k: (A) => (B) => any) => {
        var kk = function () {
          if (a !== undefined && b !== undefined) {
            k(a)(b);
          }
        };
        this.f((x: A) => {
          a = x;
          kk();
        });
        f2.apply((x: B) => {
          b = x;
          kk();
        });
      });
    };
  }

  var future = <A>(f: (A) => any) => { return new Future(f); }

  class ReaderT<A,B> {
    f: (A) => Monad<B>;
    constructor(f: (A) => Monad<B>) {
      this.f = f;
    }
    apply(a: A): Monad<B> {
      return this.f(a);
    };
    map<C>(g: (B) => C): ReaderT<A,C> {
      return new ReaderT((a) => {
        return this.f(a).map(g);
      });
    };
    flatMap<C>(g: (B) => ReaderT<A,C>): ReaderT<A,C> {
      return new ReaderT((a) => {
        return this.f(a).map(g).flatMap((r) => { return r.apply(a); });
      });
    };
  }

  var readerT = <A,B>(f: (A) => Monad<B>) => { return new ReaderT(f); }

  export var teep = {
    array:      array,
    fn:         fn,
    option:     option,
    validation: validation,
    list:       list,
    promise:    promise,
    reader:     reader,
    future:     future,
    readerT:    readerT,
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
