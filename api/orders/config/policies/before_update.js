"use strict";
const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');
const { Types } = require("mongoose");

/**
 * `phone-number-unique-post` policy.
 */

module.exports = async (ctx, next) => {
    if (ctx.request.body["status"] == "SUCCESS") {
        const { id } = ctx.params;
        const order = await strapi.services.orders.findOne({ id: id })
        for (let i = 0; i < order.products.length; i++) {
            // const componentProduct = await strapi
            //     .services['components-custom-products']
            //     .findOne({ id: Types.ObjectId(order.products[i].ref) });
            // if (!componentProduct) {
            //     continue
            // }
            const prod = await strapi.services['product'].findOne({
                id: Types.ObjectId(order.products[i].productID),
            });
            prod.quantity = prod.quantity - order.products[i].quantity
            await strapi.services['product'].update({id: prod.id}, {$set: {quantity: prod.quantity}})
        }
    }
    await next();
};
