# Teep [![Build Status](https://secure.travis-ci.org/earldouglas/teep.png?branch=master)](http://travis-ci.org/james/teep) [![Coverage Status](https://coveralls.io/repos/earldouglas/teep/badge.png?branch=master)](https://coveralls.io/r/earldouglas/teep?branch=master)

A JavaScript library for functional programming.

## Getting Started

**Installation:**

```sh
npm install teep
```

**Usage:**

```javascript
var teep = require('teep');

var a = teep.option(); // none
var b = a.map(function (x) { return x + 1; }); // none

var c = teep.option(41); // some(41)
var d = c.map(function (x) { return x + 1; }); // some(42)
```

## Documentation

### contains(xs, x)

`contains` takes an array and an element, and returns whether the element
exists at least once in the array.

*Example:*

```javascript
var yep  = contains([1,2,3], 2); // true
var nope = contains([1,2,3], 4); // false
```

### compose(f, g)

[*demo*](http://jsfiddle.net/earldouglas/8q1znL7n/)

`compose` takes two unary functions `f` and `g`, and combines them into a
single unary function `f ∘ g` that applies `g` to an input, passes the
output to `f`, applies `f` to it, and returns the result.

The application of `(f ∘ g)(x)` is equivalent to `f(g(x))`.

*Example:*

```javascript
function inc(x) {
  return x + 1;
}

function square(x) {
  return x * x;
}

var nine = compose(square, inc)(2); // square(inc(2)) == (2 + 1) ^ 2
var five = compose(inc, square)(2); // inc(square(2)) == (2 ^ 2) + 1
```

**Parameters**

**f**: `function`, a unary function

**g**: `function`, a unary function

### curry(f, args)

`curry` takes an n-ary function `f` and an optional array of arguments, and
returns a curried version of `f`, comprised of *n* nested unary functions
where the arity of `f` is *n*.

*Example:*

```javascript
function add(x, y) {
  return x + y;
};

var add2 = curry(add)(2);
var five = add2(3);
```

*Example:*

```javascript
function mathemagic(x, y, z) {
  return x * (y + z);
};

var fortyTwo = curry(mathemagic)(2)(20)(1);
```

**Parameters**

**f**: `function`, an n-ary function

**args**: `array`, [optional] arguments to apply to `f`

### memoize(f, cache)

`memoize` takes a function and an optional cache implementation, and
memoizes the function by backing it with the cache, if supplied, or a simple
object-based cache otherwise.

*Example:*

```javascript
function expensiveFn(n) { ... }

var cheapFn = memoize(expensiveFn);

var slowResult = cheapFn(42); // expensive computation the first time
var fastResult = cheapFn(42); // cheap cache lookup the second time
```

**Parameters**

**f**: `function`, an n-ary function

**cache**: `object`, [optional] a cache object with get(k) and put(k,v) functions

### lazy(f, cache)

`lazy` takes a function and an optional cache implementation, and creates a
function that, given input arguments, returns a lazy evaluator that will
apply the function to the arguments only when needed, and only once if
needed many times.

*Example:*

```javascript
function expensiveFn(n) { ... }

var lazyVal = lazy(expensiveFn)(42); // lazily apply 42 -- no computation yet

var slowResult = lazyVal.get(); // expensive computation the first time
var fastResult = lazyVal.get(); // cheap cache lookup the second time
```

**Parameters**

**f**: `function`, an n-ary function

**cache**: `object`, [optional] a cache object with get(k) and put(k,v) functions

### list(head, tail)

`list` constructs a linked list from a value, `head`, representing the first
element in the list, and another list, `tail`, representing the rest of the
constructed list. If `head` is null, `tail` is returned, and if `tail` is
null, the empty list is returned.

A list instance exposes the following fields:

 * `head` - the head of this list, if it is not empty
 * `tail` - the tail of this list, if it is not empty
 * `length` - returns the length of this list
 * `map(f)` - returns a new list created by applying `f` over this list
 * `flatMap(f)` - returns a new list created by applying `f` over this list and concatenating the results
 * `concat(l)` - returns the concatenation of this list with l
 * `toString()`

**Parameters**

**head**: `any`, the first element in the list

**tail**: `list`, the rest of the list

### option(value)

`option` constructs a representation of an optional value, represented as
either "some value" or "no value", depending on whether a non-null argument
was supplied.

An option instance exposes the following fields:

* `empty`
* `map(f)` - returns a new option by applying `f` over this option's value, and wrapping the result in an option
* `flatMap(f)` - returns a new option by applying `f` over this option's value, and returning the result
* `ap(a)` - assumes this option wraps a function, and returns a new option by mapping this option's function over the option `a` and returning the result
* `toString()`

**Parameters**

**value**: `any`, [optional] the value to wrap in an option

### collect(promises, callback)

Given an array of promises and a callback, passes the result of each promise
(in order) as an argument to the callback, and returns a single promise that
yields the result of the callback.

Any of the promises can be 'lazy', implemented as a nullary function that
returns a promise, and will be retrieved as late as possible.

*Example:*

```javascript
var p = collect([
  Promise.resolve(2),
  Promise.resolve(20),
  Promise.resolve(1)
], function (x, y, z) {
  return x * (y + z);
});
```

p is congruent to `Promise.resolve(2 * (20 + 1))`, or `Promise.resolve(42)`

**Parameters**

**promises**: `array`, an array of promises

**callback**: `function`, a function that takes as arguments the results of the promises

### valid(value)

`valid` constructs a "validation" representing a valid value.

A validation created by `valid` exposes the following fields:

* `valid` - returns true
* `value` - returns the (valid) value
* `map(f) - returns a new (valid) validation by mapping `f` over this validation's value and wrapping the in a (valid) validation
* `flatMap(f) - returns a new validation result by mapping `f` over this validation's value and returning the result
* `ap(a)` - assumes this validation wraps a function, and returns a new validation by mapping this validation's function over the validation `a` and returning the result
* `toString()`

**Parameters**

**value**: `any`, a valid value to wrap in a validation

### invalid(errors)

`invalid` constructs a "validation" representing an invalid value, and
containing an array of errors.

A validation created by `invalid` exposes the following fields:

* `valid` - returns false
* `errors` - returns the array of errors
* `map(f)` - returns a this validation
* `flatMap(f)` - returns this validation
* `ap(a)` - if `a` is valid, return this validation, otherwise returns a new (invalid) validation containing the concatenation of this validation's errors with `a`'s errors
* `toString()`

**Parameters**

**errors**: `array`, an array of errors to wrap in a validation

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 James Earl Douglas
Licensed under the MIT license.
