const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.category.findOne({ slug });
    return sanitizeEntity(entity, { model: strapi.models.category });
  },

  async searchByName(ctx) {
    if (!ctx.request.query['name']) {
      return await strapi.services.category.find({}); 
    }
    const res = await strapi.services.category.find({ name: {$regex: ctx.request.query["name"]}, isDeleted: false }); 
    return res
  }
};
