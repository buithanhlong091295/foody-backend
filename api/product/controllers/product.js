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
  },

  async notifyByMail(ctx) {
    const users = await strapi.plugins['users-permissions'].services.user.fetchAll()
    // console.log(users)
    for(let i = 0; i< users.length; i++) {
      await strapi.plugins['email'].services.email.send({
        to: users[i].email,
        subject: "A NEW FOOD",
        text: "We have a new food, it is " + ctx.request.body["productName"] + ", if you want to try it open the Foody app now!"
      })
    }
    return {status: "ok"}
  }
};
