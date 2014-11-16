# Teep [![Build Status](https://secure.travis-ci.org/earldouglas/teep.png?branch=master)](http://travis-ci.org/james/teep)

A JavaScript library for functional programming.

## Getting Started
Install the module with: `npm install teep`

```javascript
var teep = require('teep');
teep.option(); // none
teep.option(x); // some(x)
```

## Documentation

###Index

**Classes**

* [class: option](#option)
  * [new option(x)](#new_option)
* [class: valid](#valid)
  * [new valid(value)](#new_valid)
* [class: invalid](#invalid)
  * [new invalid(errors)](#new_invalid)
 
<a name="option"></a>
###class: option
**Members**

* [class: option](#option)
  * [new option(x)](#new_option)

<a name="new_option"></a>
####new option(x)
Creates an option instance.

**Params**

- x `any` - The optional value.  

**Returns**:  - some(x), or none() if x is null.  
<a name="valid"></a>
###class: valid
**Members**

* [class: valid](#valid)
  * [new valid(value)](#new_valid)

<a name="new_valid"></a>
####new valid(value)
Creates a valid validation instance.

**Params**

- value `any` - The valid value.  

**Returns**:  - valid(value).  
<a name="invalid"></a>
###class: invalid
**Members**

* [class: invalid](#invalid)
  * [new invalid(errors)](#new_invalid)

<a name="new_invalid"></a>
####new invalid(errors)
Creates an invalid validation instance.

**Params**

- errors `Array.<any>` - The validation errors.  

**Returns**:  - invalid([errors]).  

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### 0.2.0

* Validation, via `valid(x)` and `invalid([xs])`
* Fix for `option(false)` returning `none()`

### 0.1.2

* Option, via `option(x)` and `option()`

## License
Copyright (c) 2014 James Earl Douglas  
Licensed under the MIT license.
