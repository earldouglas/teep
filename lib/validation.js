/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';

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
