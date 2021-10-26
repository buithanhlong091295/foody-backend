"use strict";
const _ = require('lodash');

/**
 * `phone-number-unique-post` policy.
 */

module.exports = async (ctx, next) => {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
          const { id, isAdmin = false } = await strapi.plugins[
            'users-permissions'
          ].services.jwt.getToken(ctx);
    
        ctx.request.body["userID"] = id
    }
    await next();
};
