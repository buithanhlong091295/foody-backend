'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async getCart(ctx) {
        const query = {
          userID: ctx.request.query["userID"],
        };
        const cart = await strapi
          .query("carts")
          .model.aggregate([{ $match: query }, { $sort: { createdAt: -1 } }, {$limit: 1}]);
        if (cart && cart.products.length > 0) {
            for (let i = 0; i < cart.products.length; i++) {
                const product = await strapi.services.products.findOne({
                    id: cart.products[i].productID,
                });
                if (product) {
                    cart.products[i] = {
                        productID: cart.products[i].productID,
                        quantity: cart.products[i].quantity,
                        amount: cart.products[i].amount,
                        productName: product.name,
                        productImage: product.image,
                    }
                }
            }
        }
        return cart
      }
};
