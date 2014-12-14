'use strict';
 
/**
 * `nil` represents the empty linked list. It can be treated as a singleton, as
 * any reference to an empty linked list is indistinguishable from another.
 *
 * `nil` exposes the following fields:
 *
 *  * `length` - returns 0
 *  * `map(f)` - returns nil
 *  * `flatMap(f)` - returns nil
 *  * `concat(l)` - returns l
 *  * `toString()`
 *
 */
var nil = {
  length   : 0,
  map      : function() { return this; },
  flatMap  : function() { return this; },
  concat   : function(l) { return l; },
  toString : function() { return 'nil'; }
};

/**
 * `cons` constructs a linked list from a value, `head`, representing the first
 * element in the list, and another list, `tail`, representing the rest of the
 * constructed list.
 *
 * A list instance created by `cons` exposes the following fields:
 *
 *  * `head`
 *  * `tail`
 *  * `length` - returns 1 + the length of `tail`
 *  * `map(f)` - returns a new list created by applying `f` over this list
 *  * `flatMap(f)` - returns a new list created by applying `f` over this list and concatenating the results
 *  * `concat(l)` - returns the concatenation of this list with l
 *  * `toString()`
 *
 * @param head {any} the first element in the list
 * @param tail {list} the rest of the list
 *
 */
function cons(head, tail) {
  return {
    head     : head,
    tail     : tail,
    length   : 1 + tail.length,
    map      : function(f) { return cons(f(head), tail.map(f)); },
    flatMap  : function(f) { return f(head).concat(tail.flatMap(f)); },
    concat   : function(l) { return cons(head, tail.concat(l)); },
    toString : function() { return 'cons(' + head.toString() + ', ' + tail.toString() + ')'; }
  };
}

exports.cons = cons;
exports.nil  = nil;
