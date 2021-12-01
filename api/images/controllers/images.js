'use strict';
var fs = require('fs');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        const res = await strapi.query("images").create({ value: ctx.request.body["value"] })
        base64_decode(res.value, './public/uploads/' + res.id + '.png');
        return {id: res.id}
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const res = await strapi.query("images").findOne({ id })
        if (!res) {
            return ctx.badRequest("Image not exist")
        }
        base64_decode(res.value, './public/uploads/' + res.id + '.png');
        return { url: '/uploads/' + res.id + '.png' }
    }
};

function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
}
