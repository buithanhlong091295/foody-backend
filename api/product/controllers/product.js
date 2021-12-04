const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.product.findOne({ slug });
    return sanitizeEntity(entity, { model: strapi.models.product });
  },

  async searchByName(ctx) {
    if (!ctx.request.query['name']) {
      return await strapi.services.product.find({}); 
    }
    const res = await strapi.services.product.find({ name: {$regex: ctx.request.query["name"]}, isDeleted: false }); 
    return res
  }
};
