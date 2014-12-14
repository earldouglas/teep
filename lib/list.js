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

/**
 * `list` constructs a linked list from a value, `head`, representing the first
 * element in the list, and another list, `tail`, representing the rest of the
 * constructed list. If `head` is null, `tail` is returned, and if `tail` is
 * null, the empty list is returned.
 *
 * A list instance exposes the following fields:
 *
 *  * `head` - the head of this list, if it is not empty
 *  * `tail` - the tail of this list, if it is not empty
 *  * `length` - returns the length of this list
 *  * `map(f)` - returns a new list created by applying `f` over this list
 *  * `flatMap(f)` - returns a new list created by applying `f` over this list and concatenating the results
 *  * `concat(l)` - returns the concatenation of this list with l
 *  * `toString()`
 *
 * @param head {any} the first element in the list
 * @param tail {list} the rest of the list
 *
 */
function list(head, tail) {
  if (tail == null) {
    return list(head, _nil);
  } else if (head == null) {
    return tail;
  } else {
    return _cons(head, tail);
  }
}

exports.list = list;
