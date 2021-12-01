"use strict";
var fs = require('fs');
const _ = require('lodash');

/**
 * `phone-number-unique-post` policy.
 */

module.exports = async (ctx, next) => {
  
  await next();
};
