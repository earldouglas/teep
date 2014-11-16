/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';
 
/**
 * Creates an option instance.
 * @param {any} value - The optional value.
 * @returns some(value), or none() if value is null.
 */
function option(value) {
  if (value != null) {
    return {
        empty    : false
      , map      : function(f) { return option(f(value)); }
      , flatMap  : function(f) { return f(value); }
      , ap       : function(a) { return a.map(value); }
      , toString : function()  { return 'some(' + value.toString() + ')'; }
    };
  } else {
    return {
        empty    : true
      , map      : function(f) { return this; }
      , flatMap  : function(f) { return this; }
      , ap       : function(a) { return this; }
      , toString : function()  { return 'none()'; }
    };
  }
}

exports.option = option;
