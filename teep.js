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
var array      = require('./' + lib + '/array');

exports.option     = option;
exports.validation = validation;
exports.list       = list;
exports.promise    = promise;
exports.fn         = fn;
exports.array      = array;
