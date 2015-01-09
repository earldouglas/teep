'use strict';

function contains(xs, x) {
  for (var i = 0; i < xs.length; i++) {
    if (xs[i] === x) {
      return true;
    }
  }
  return false;
}

module.exports.contains = contains;
