'use strict';
 
function option(value) {
  if (value || value === false || value === 0 || value === '') {
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

module.exports = option;
