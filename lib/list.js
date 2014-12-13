'use strict';
 
/**
 * The empty list
 */
var nil = {
  length   : 0,
  map      : function() { return this; },
  flatMap  : function() { return this; },
  concat   : function(l) { return l; },
  toString : function() { return 'nil'; }
};

/**
 * A list constructor
 * @param head The first element in the list
 * @param tail The list of elements that follow `head`
 * @returns A list of elements with `head` prepended onto `tail`
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
