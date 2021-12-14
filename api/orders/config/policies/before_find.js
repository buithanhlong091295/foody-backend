"use strict";
const _ = require('lodash');

/**
 * `phone-number-unique-post` policy.
 */

module.exports = async (ctx, next) => {
  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    const { id } = await strapi.plugins[
      'users-permissions'
    ].services.jwt.getToken(ctx);

  ctx.request.query["userID"] = id
  ctx.request.query["_sort"] = "createdAt:DESC"
}
await next();
};
