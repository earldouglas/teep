/*
 * teep
 * https://github.com/earldouglas/teep
 *
 * Copyright (c) 2014 James Earl Douglas
 * Licensed under the MIT license.
 */

'use strict';

var option     = require("./option")
var validation = require("./validation")

exports.option  = option.option;
exports.valid   = validation.valid;
exports.invalid = validation.invalid;
