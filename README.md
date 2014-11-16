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

###Index

**Functions**

* [option(value)](#option)
* [valid(value)](#valid)
* [invalid(errors)](#invalid)
 
<a name="option"></a>
###option(value)
Creates an option instance.

**Params**

- value `any` - The optional value.  

**Returns**:  - some(value), or none() if value is null.  
<a name="valid"></a>
###valid(value)
Creates a valid validation instance.

**Params**

- value `any` - The valid value.  

**Returns**:  - valid(value).  
<a name="invalid"></a>
###invalid(errors)
Creates an invalid validation instance.

**Params**

- errors `Array.<any>` - The validation errors.  

**Returns**:  - invalid(errors).  

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### 0.2.0

* Validation, via `valid(value)` and `invalid(errors)`
* Fix for `option(false)` returning `none()`

### 0.1.2

* Option, via `option(value)` and `option()`

## License
Copyright (c) 2014 James Earl Douglas  
Licensed under the MIT license.
