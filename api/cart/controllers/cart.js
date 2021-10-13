'use strict';

const { sanitizeEntity } = require('strapi-utils');
const { Types } = require("mongoose");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async getCart(ctx) {
        const query = {
            userID: ctx.request.query["userID"],
        };
        const res = await strapi
            .query("cart")
            .model.aggregate([{ $match: query }, { $sort: { createdAt: -1 } }, { $limit: 1 }]);
        const cart = sanitizeEntity(res[0], {
            model: strapi.models.cart,
        });
        if (cart && cart.products.length > 0) {
            for (let i = 0; i < cart.products.length; i++) {
                const componentProduct = await strapi
                    .services['components-custom-products']
                    .findOne({ id:  Types.ObjectId(cart.products[i].ref)});
                if (!componentProduct) {
                    continue
                }
                const product = await strapi.services['product'].findOne({
                    id: Types.ObjectId(componentProduct.productID),
                });
                if (product) {
                    cart.products[i] = {
                        productID: componentProduct.productID,
                        quantity: componentProduct.quantity,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                    }
                }
            }
        }
        return cart
    }
};
