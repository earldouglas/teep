/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */
var exports;
var edc;
(function (edc) {
    var array = {
        contains: function (xs, x) {
            for (var i = 0; i < xs.length; i++) {
                if (xs[i] === x) {
                    return true;
                }
            }
            return false;
        }
    };
    var DumbCache = (function () {
        function DumbCache() {
            var _this = this;
            this.cache = {};
            this.get = function (k) { return _this.cache[k]; };
            this.put = function (k, v) { _this.cache[k] = v; };
        }
        return DumbCache;
    })();
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
            return function (x) {
                args.push(x);
                if (f.length === args.length) {
                    return f.apply(null, args);
                }
                else {
                    return fn.curry(f, args);
                }
            };
        },
        memoize: function (f, cache) {
            cache = cache || new DumbCache();
            return function (x) {
                var val = cache.get(x);
                if (val === undefined) {
                    val = f(x);
                    cache.put(x, val);
                    return val;
                }
                else {
                    return val;
                }
            };
        },
        lazy: function (f, cache) {
            var fMemo = fn.memoize(f, cache);
            return function (x) {
                return {
                    get: function () { return fMemo(x); }
                };
            };
        }
    };
    var Some = (function () {
        function Some(value) {
            var _this = this;
            this.empty = false;
            this.map = function (f) { return option(f(_this.value)); };
            this.flatMap = function (f) { return f(_this.value); };
            this.ap = function (x) { return x.map(function (f) { return f(_this.value); }); };
            this.toString = function () { return 'some(' + _this.value.toString() + ')'; };
            this.value = value;
        }
        return Some;
    })();
    var None = (function () {
        function None() {
            var _this = this;
            this.empty = true;
            this.map = function () { return _this; };
            this.flatMap = function () { return _this; };
            this.ap = function () { return _this; };
            this.toString = function () { return 'none()'; };
        }
        return None;
    })();
    var _none = new None();
    var option = function (value) {
        if (value !== null && typeof value !== 'undefined') {
            return new Some(value);
        }
        else {
            return _none;
        }
    };
    var Valid = (function () {
        function Valid(value) {
            var _this = this;
            this.valid = true;
            this.map = function (f) { return validation.valid(f(_this.value)); };
            this.flatMap = function (f) { return f(_this.value); };
            this.ap = function (a) { return a.map(_this.value); };
            this.toString = function () { return 'valid(' + _this.value.toString() + ')'; };
            this.value = value;
        }
        return Valid;
    })();
    var Invalid = (function () {
        function Invalid(errors) {
            var _this = this;
            this.valid = false;
            this.map = function (f) { return _this; };
            this.flatMap = function (f) { return _this; };
            this.ap = function (a) { return a.valid ? _this : validation.invalid(_this.errors.concat(a.errors)); };
            this.toString = function () { return 'invalid(' + _this.errors.toString() + ')'; };
            this.errors = errors;
        }
        return Invalid;
    })();
    var validation = {
        valid: function (value) { return new Valid(value); },
        invalid: function (errors) { return new Invalid(errors); }
    };
    var Nil = (function () {
        function Nil() {
            var _this = this;
            this.length = 0;
            this.map = function () { return _this; };
            this.flatMap = function () { return _this; };
            this.concat = function (l) { return l; };
            this.toString = function () { return 'nil'; };
        }
        return Nil;
    })();
    var Cons = (function () {
        function Cons(head, tail) {
            var _this = this;
            this.map = function (f) { return new Cons(f(_this.head), _this.tail.map(f)); };
            this.flatMap = function (f) { return f(_this.head).concat(_this.tail.flatMap(f)); };
            this.concat = function (l) { return new Cons(_this.head, _this.tail.concat(l)); };
            this.toString = function () { return 'cons(' + _this.head + ', ' + _this.tail.toString() + ')'; };
            this.head = head;
            this.tail = tail;
            this.length = 1 + this.tail.length;
        }
        return Cons;
    })();
    var _nil = new Nil();
    var list = function (head, tail) {
        if (tail === undefined || tail === null) {
            return list(head, _nil);
        }
        else if (head === undefined || head === null) {
            return tail;
        }
        else {
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
    var Reader = (function () {
        function Reader(f) {
            this.f = f;
        }
        Reader.prototype.apply = function (a) {
            return this.f(a);
        };
        ;
        Reader.prototype.map = function (g) {
            var _this = this;
            return new Reader(function (a) {
                return g(_this.f(a));
            });
        };
        ;
        Reader.prototype.flatMap = function (g) {
            var _this = this;
            return new Reader(function (a) {
                return g(_this.f(a)).apply(a);
            });
        };
        ;
        return Reader;
    })();
    var reader = function (f) { return new Reader(f); };
    var read = new Reader(function (x) {
        return x;
    });
    var Future = (function () {
        function Future(f) {
            this.f = f;
        }
        Future.prototype.apply = function (k) {
            this.f(k);
        };
        ;
        Future.prototype.map = function (g) {
            var _this = this;
            return new Future(function (k) {
                return _this.f(function (a) {
                    k(g(a));
                });
            });
        };
        ;
        Future.prototype.flatMap = function (g) {
            var _this = this;
            return new Future(function (k) {
                return _this.f(function (a) {
                    g(a).apply(k);
                });
            });
        };
        ;
        Future.prototype.sequence = function (f2) {
            var _this = this;
            var a;
            var b;
            return new Future(function (k) {
                var kk = function () {
                    if (a !== undefined && b !== undefined) {
                        k(a)(b);
                    }
                };
                _this.f(function (x) {
                    a = x;
                    kk();
                });
                f2.apply(function (x) {
                    b = x;
                    kk();
                });
            });
        };
        ;
        return Future;
    })();
    var future = function (f) { return new Future(f); };
    var ReaderT = (function () {
        function ReaderT(f) {
            this.f = f;
        }
        ReaderT.prototype.apply = function (a) {
            return this.f(a);
        };
        ;
        ReaderT.prototype.map = function (g) {
            var _this = this;
            return new ReaderT(function (a) {
                return _this.f(a).map(g);
            });
        };
        ;
        ReaderT.prototype.flatMap = function (g) {
            var _this = this;
            return new ReaderT(function (a) {
                return _this.f(a).map(g).flatMap(function (r) { return r.apply(a); });
            });
        };
        ;
        return ReaderT;
    })();
    var readerT = function (f) { return new ReaderT(f); };
    edc.teep = {
        array: array,
        fn: fn,
        option: option,
        validation: validation,
        list: list,
        promise: promise,
        reader: reader,
        read: read,
        future: future,
        readerT: readerT
    };
    var setExports = function () {
        for (var i in edc.teep) {
            var setExport = function () {
                exports[i] = edc.teep[i];
            };
            !edc.teep.hasOwnProperty(i) || setExport();
        }
    };
    !exports || setExports();
})(edc || (edc = {}));
