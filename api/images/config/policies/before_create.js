"use strict";
const _ = require('lodash');
const imageToBase64 = require('image-to-base64');
var fs = require('fs');
/**
 * `phone-number-unique-post` policy.
 */

module.exports = async (ctx, next) => {
    var base64str = base64_encode(ctx.request.files.file.path);
    ctx.request.body["value"] = base64str
    ctx.request.body["name"] = "test"
    await next();
};

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}
