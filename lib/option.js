'use strict';
 
/**
 * `option` constructs a representation of an optional value, represented as
 * either "some value" or "no value", depending on whether a non-null argument
 * was supplied.
 *
 * An `option` instance exposes the following fields:
 *
 * * `empty`
 * * `map(f)` - returns a new option by applying `f` over this option's value,
                and wrapping the result in an option
 * * `flatMap(f)` - returns a new option by applying `f` over this option's
                    value, and returning the result
 * * `ap(a)` - assumes this option wraps a function, and returns a new option
               by mapping this option's function over the option `a` and
               returning the result
 * * `toString()`
 *
 */
function option(value) {
  if (value != null) {
    return {
      empty    : false,
      map      : function(f) { return option(f(value)); },
      flatMap  : function(f) { return f(value); },
      ap       : function(a) { return a.map(value); },
      toString : function()  { return 'some(' + value.toString() + ')'; }
    };
  } else {
    return {
      empty    : true,
      map      : function() { return this; },
      flatMap  : function() { return this; },
      ap       : function() { return this; },
      toString : function() { return 'none()'; }
    };
  }
}

exports.option = option;
