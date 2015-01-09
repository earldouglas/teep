'use strict';
 
var _nil = {
  length   : 0,
  map      : function() { return this; },
  flatMap  : function() { return this; },
  concat   : function(l) { return l; },
  toString : function() { return 'nil'; }
};

function _cons(head, tail) {
  return {
    head     : head,
    tail     : tail,
    length   : 1 + tail.length,
    map      : function(f) { return _cons(f(head), tail.map(f)); },
    flatMap  : function(f) { return f(head).concat(tail.flatMap(f)); },
    concat   : function(l) { return _cons(head, tail.concat(l)); },
    toString : function() { return 'cons(' + head + ', ' + tail.toString() + ')'; }
  };
}

function list(head, tail) {
  if (tail == null) {
    return list(head, _nil);
  } else if (head == null) {
    return tail;
  } else {
    return _cons(head, tail);
  }
}

module.exports = list;
