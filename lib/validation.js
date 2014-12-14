'use strict';

/**
 * `valid` constructs a "validation" representing a valid value.
 *
 * A validation created by `valid` exposes the following fields:
 *
 * * `valid` - returns true
 * * `value` - returns the (valid) value
 * * `map(f) - returns a new (valid) validation by mapping `f` over this
               validation's value and wrapping the in a (valid) validation
 * * `flatMap(f) - returns a new validation result by mapping `f` over this
                   validation's value and returning the result
 * * `ap(a)` - assumes this validation wraps a function, and returns a new
               validation by mapping this validation's function over the
               validation `a` and returning the result
 * * `toString()`
 *
 * @param value {any} a valid value to wrap in a validation
 *
 */
function valid(value) {
  return {
      valid    : true
    , value    : value
    , map      : function(f) { return valid(f(value)); }
    , flatMap  : function(f) { return f(value); }
    , ap       : function(a) { return a.map(value); }
    , toString : function()  { return 'valid(' + value.toString() + ')'; }
  };
}

/**
 * `invalid` constructs a "validation" representing an invalid value, and
 * containing an array of errors.
 *
 * A validation created by `invalid` exposes the following fields:
 *
 * * `valid` - returns false
 * * `errors` - returns the array of errors
 * * `map(f) - returns a this validation
 * * `flatMap(f) - returns this validation
 * * `ap(a)` - if `a` is valid, return this validation, otherwise returns a new
               (invalid) validation containing the concatenation of this
               validation's errors with `a`'s errors
 * * `toString()`
 *
 * @param errors {array} an array of errors to wrap in a validation
 *
 */
function invalid(errors) {
  return {
      valid    : false
    , errors   : errors
    , map      : function(f) { return this; }
    , flatMap  : function(f) { return this; }
    , ap       : function(a) {
                   if (a.valid) { return this; }
                   else { return invalid(this.errors.concat(a.errors)); }
                 }
    , toString : function() { return 'invalid(' + errors.toString() + ')'; }
  };
}

exports.valid   = valid;
exports.invalid = invalid;
