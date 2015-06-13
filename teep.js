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
    var validation = {
        valid: function (value) {
            return {
                valid: true,
                value: value,
                map: function (f) { return validation.valid(f(value)); },
                flatMap: function (f) { return f(value); },
                ap: function (a) { return a.map(value); },
                toString: function () { return 'valid(' + value.toString() + ')'; }
            };
        },
        invalid: function (errors) {
            var self = {
                valid: false,
                errors: errors,
                map: function () { return self; },
                flatMap: function () { return self; },
                ap: function (a) {
                    if (a.valid) {
                        return self;
                    }
                    else {
                        return validation.invalid(errors.concat(a.errors));
                    }
                },
                toString: function () { return 'invalid(' + errors.toString() + ')'; }
            };
            return self;
        }
    };
    var list = function (head, tail) {
        var _nil = {
            length: 0,
            map: function () { return this; },
            flatMap: function () { return this; },
            concat: function (l) { return l; },
            toString: function () { return 'nil'; }
        };
        var _cons = function (head, tail) {
            return {
                head: head,
                tail: tail,
                length: 1 + tail.length,
                map: function (f) { return _cons(f(head), tail.map(f)); },
                flatMap: function (f) { return f(head).concat(tail.flatMap(f)); },
                concat: function (l) { return _cons(head, tail.concat(l)); },
                toString: function () {
                    return 'cons(' + head + ', ' + tail.toString() + ')';
                }
            };
        };
        if (tail === undefined || tail === null) {
            return list(head, _nil);
        }
        else if (head === undefined || head === null) {
            return tail;
        }
        else {
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
                return future(function (k) {
                    return f(function (x) {
                        return k(g(x));
                    });
                });
            },
            flatMap: function (g) {
                return future(function (k) {
                    return f(function (x) {
                        return g(x).apply(k);
                    });
                });
            },
            sequence: function (f2) {
                var xs = [];
                return future(function (k) {
                    var kk = function () {
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
    edc.teep = {
        array: array,
        fn: fn,
        option: option,
        validation: validation,
        list: list,
        promise: promise,
        future: future
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
