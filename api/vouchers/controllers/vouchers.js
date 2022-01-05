'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async notifyByMail(ctx) {
        const users = await strapi.plugins['users-permissions'].services.user.fetchAll()
        // console.log(users)
        for(let i = 0; i< users.length; i++) {
          await strapi.plugins['email'].services.email.send({
            to: users[i].email,
            subject: "A VOUCHER FOR YOU",
            text: "We have a voucher for you, enter " + ctx.request.body["code"] + " to get " + ctx.request.body["promotionAmount"] + "VND off for orders overs " + ctx.request.body["applyForOrderValue"] + "VDN, so open the Foody app and order now!"
          })
        }
        return {status: "ok"}
      }
};
