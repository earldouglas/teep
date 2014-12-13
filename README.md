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

### curry(f) 

Curries a function

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

**f**: An n-ary function to curry

**Returns**: Nested unary functions with depth of `f`'s arity

### cons(head, tail) 

Constructs a linked list

**Parameters**

**head**: The first element in the list

**tail**: The list of elements that follow `head`

**Returns**: A list of elements with `head` prepended onto `tail`

### option(value) 

Creates an option instance

**Parameters**

**value**: `any`, The optional value

**Returns**: some(value), or none() if value is null

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

**promises**: An array of Promise instances or Promise-returning functions

**callback**: A function that takes as arguments the results of the promises

### valid(value) 

Creates a valid validation instance

**Parameters**

**value**: `any`, The valid value

**Returns**: valid(value)


### invalid(errors) 

Creates an invalid validation instance

**Parameters**

**errors**: `Array<any>`, The validation errors

**Returns**: invalid(errors)

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
