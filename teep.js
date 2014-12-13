/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';

var option     = require("./lib/option");
var validation = require("./lib/validation");
var list       = require("./lib/list");
var promise    = require("./lib/promise");
var fn         = require("./lib/function");

exports.option    = option.option;
exports.valid     = validation.valid;
exports.invalid   = validation.invalid;
exports.cons      = list.cons;
exports.nil       = list.nil;
exports.collect   = promise.collect;
exports.collectFn = promise.collectFn;
exports.curry     = fn.curry;
