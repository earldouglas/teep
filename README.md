# Teep [![Build Status](https://secure.travis-ci.org/earldouglas/teep.png?branch=master)](http://travis-ci.org/james/teep)

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

### compose() 

`compose` takes two unary functions `f` and `g`, and combines them into a
single unary function `f ∘ g` that applies `g` to an input, passes the
output to `f`, applies `f` to it, and returns the result.

The application of `(f ∘ g)(x)` is equivalent to `f(g(x))`.

### curry() 

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

### cons() 

`cons` constructs a linked list from a value, `head`, representing the first
element in the list, and another list, `tail`, representing the rest of the
constructed list.

A list instance created by `cons` exposes the following fields:

 * `head`
 * `tail`
 * `length` - returns 1 + the length of tail
 * `map(f)` - returns a new list created by applying `f` over this list
 * `flatMap(f)` - returns a new list created by applying `f` over this list
                     and concatenating the results
 * `concat(l)` - returns the concatenation of this list with l
 * `toString()`

### option() 

`option` constructs a representation of an optional value, represented as
either "some value" or "no value", depending on whether a non-null argument
was supplied.

An `option` instance exposes the following fields:

* `empty`
* `map(f)` - returns a new option by applying `f` over this option's value,
                and wrapping the result in an option
* `flatMap(f)` - returns a new option by applying `f` over this option's
                    value, and returning the result
* `ap(a)` - assumes this option wraps a function, and returns a new option
               by mapping this option's function over the option `a` and
               returning the result
* `toString()`

### collect() 

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

### valid() 

`valid` constructs a "validation" representing a valid value.

A validation created by `valid` exposes the following fields:

* `valid` - returns true
* `value` - returns the (valid) value
* `map(f) - returns a new (valid) validation by mapping `f` over this
               validation's value and wrapping the in a (valid) validation
* `flatMap(f) - returns a new validation result by mapping `f` over this
                   validation's value and returning the result
* `ap(a)` - assumes this validation wraps a function, and returns a new
               validation by mapping this validation's function over the
               validation `a` and returning the result
* `toString()`

### invalid() 

`invalid` constructs a "validation" representing an invalid value, and
containing an array of errors.

A validation created by `invalid` exposes the following fields:

* `valid` - returns false
* `errors` - returns the array of errors
* `map(f) - returns a this validation
* `flatMap(f) - returns this validation
* `ap(a)` - if `a` is valid, return this validation, otherwise returns a new
               (invalid) validation containing the concatenation of this
               validation's errors with `a`'s errors
* `toString()`

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History

### 0.3.1

* Documentation aggregation

### 0.3.0

* Linked lists, via `cons(head, tail)` and `nil`
* Function currying, via `curry(f)`
* Promises aggregation, via `collect(promises, callback)`

### 0.2.0

* Validation, via `valid(value)` and `invalid(errors)`
* Fix for `option(false)` returning `none()`

### 0.1.2

* Option, via `option(value)` and `option()`

## License
Copyright (c) 2014 James Earl Douglas  
Licensed under the MIT license.
