/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';

function option(x) {
  if (x != null) {
    return {
        empty    : false
      , map      : function(f) { return option(f(x)); }
      , flatMap  : function(f) { return f(x); }
      , ap       : function(a) { return a.map(x); }
      , toString : function()  { return 'some(' + x.toString() + ')'; }
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
