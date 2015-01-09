'use strict';

function valid(value) {
  return {
    valid    : true,
    value    : value,
    map      : function(f) { return valid(f(value)); },
    flatMap  : function(f) { return f(value); },
    ap       : function(a) { return a.map(value); },
    toString : function()  { return 'valid(' + value.toString() + ')'; }
  };
}

function invalid(errors) {
  return {
    valid    : false,
    errors   : errors,
    map      : function() { return this; },
    flatMap  : function() { return this; },
    ap       : function(a) {
                 if (a.valid) { return this; }
                 else { return invalid(this.errors.concat(a.errors)); }
               },
    toString : function() { return 'invalid(' + errors.toString() + ')'; }
  };
}

exports.valid   = valid;
exports.invalid = invalid;
