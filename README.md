# Teep [![Build Status](https://secure.travis-ci.org/earldouglas/teep.png?branch=master)](http://travis-ci.org/james/teep)

A JavaScript library for functional programming.

## Getting Started
Install the module with: `npm install teep`

```javascript
var teep = require('teep');
teep.option(); // none
teep.option(value); // some(value)
```

## Documentation

See the [doc](https://github.com/earldouglas/teep/tree/master/doc) directory.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History

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
