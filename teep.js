/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';

// Use instrumented code for code coverage tests
var lib = process.env.LIB_COV ? 'lib-cov' : 'lib';

var option     = require('./' + lib + '/option');
var validation = require('./' + lib + '/validation');
var list       = require('./' + lib + '/list');
var promise    = require('./' + lib + '/promise');
var fn         = require('./' + lib + '/function');

exports.option    = option.option;
exports.valid     = validation.valid;
exports.invalid   = validation.invalid;
exports.list      = list.list;
exports.collect   = promise.collect;
exports.curry     = fn.curry;
exports.compose   = fn.compose;
exports.memoize   = fn.memoize;
exports.lazy      = fn.lazy;
