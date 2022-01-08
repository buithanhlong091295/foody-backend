'use strict';

const { sanitizeEntity } = require('strapi-utils');
const { Types } = require("mongoose");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async statistics(ctx) {
        let from = new Date(parseInt(ctx.request.query["from"]))
        let fromInt64 = parseInt(ctx.request.query["from"])
        let to = new Date(parseInt(ctx.request.query["to"]))
        let toInt64 = parseInt(ctx.request.query["to"])
        const null_date = new Date(0);
        const statistics = await strapi.query("orders").model.aggregate([
            {
                $match: {
                  status: "SUCCESS",
                  isPaid: true,
                  createdAt: {
                      $gte: from,
                      $lte: to,
                  }
                },
            },
            {
                $group: {
                    _id: {
                        "time": {
                            "year":  {"$year": "$createdAt"},
                            "month": {"$month": "$createdAt"},
                            "day":   {"$dayOfMonth": "$createdAt"},
                        },
                    },
                    revenue: {
                        "$sum": "$totalAmount",
                    },
                },
            },
            {
                $addFields: {
                    "timestamp": {
                        "$divide": [
                            {
                                "$subtract": [
                                {
                                    "$dateFromParts": {
                                    "year":  "$_id.time.year",
                                    "month": "$_id.time.month",
                                    "day":   "$_id.time.day",
                                    }
                                }, null_date],
                            },
                            1
                        ]
                    }
                },
            },
            {
                $sort: {
                    "timestamp": 1
                }
            }
        ])
        // console.log(statistics)
        let data = {}
        for (let i = 0; i < statistics.length ; i++) {
            data[statistics[i].timestamp] = statistics[i]
        }
        // console.log(data)
        let res = []

        for(let i = 0;fromInt64 <= toInt64; i++) {
            let d = {
                revenue: 0,
                day: new Date(fromInt64)
            }
            if (data[fromInt64]) {
                d["revenue"] = data[fromInt64].revenue
            }
            res.push(d)
            fromInt64 += 86400000
        }
        return res
    },

    async searchByMail(ctx) {
        if (!ctx.request.query['email']) {
          return await strapi.services.orders.find({}); 
        }
        const res = await strapi.services.orders.find({ email: {$regex: ctx.request.query["email"]} }); 
        return res
    },

    async statisticsNumOrders(ctx) {
        let from = new Date(parseInt(ctx.request.query["from"]))
        let fromInt64 = parseInt(ctx.request.query["from"])
        let to = new Date(parseInt(ctx.request.query["to"]))
        let toInt64 = parseInt(ctx.request.query["to"])
        const null_date = new Date(0);
        const statistics = await strapi.query("orders").model.aggregate([
            {
                $match: {
                  status: "SUCCESS",
                  isPaid: true,
                  createdAt: {
                      $gte: from,
                      $lte: to,
                  }
                },
            },
            {
                $group: {
                    _id: {
                        "time": {
                            "year":  {"$year": "$createdAt"},
                            "month": {"$month": "$createdAt"},
                            "day":   {"$dayOfMonth": "$createdAt"},
                        },
                    },
                    totalOrders: {
                        "$sum": 1,
                    },
                },
            },
            {
                $addFields: {
                    "timestamp": {
                        "$divide": [
                            {
                                "$subtract": [
                                {
                                    "$dateFromParts": {
                                    "year":  "$_id.time.year",
                                    "month": "$_id.time.month",
                                    "day":   "$_id.time.day",
                                    }
                                }, null_date],
                            },
                            1
                        ]
                    }
                },
            },
            {
                $sort: {
                    "timestamp": 1
                }
            }
        ])
        // console.log(statistics)
        let data = {}
        for (let i = 0; i < statistics.length ; i++) {
            data[statistics[i].timestamp] = statistics[i]
        }
        // console.log(data)
        let res = []

        for(let i = 0;fromInt64 <= toInt64; i++) {
            let d = {
                totalOrders: 0,
                day: new Date(fromInt64)
            }
            if (data[fromInt64]) {
                d["totalOrders"] = data[fromInt64].totalOrders
            }
            res.push(d)
            fromInt64 += 86400000
        }
        return res
    },

    async statisticsOrderWithPaymentType(ctx) {
        const statistics = await strapi.query("orders").model.aggregate([
            {
                $match: {
                  isPaid: true,
                },
            },
            {
                $group: {
                    _id: "$paymentType",
                    totalOrders: {
                        "$sum": 1,
                    },
                },
            },
        ])
        let res = []
        res.push({_id: "DIRECT", totalOrders: 0})
        res.push({_id: "ONLINE", totalOrders: 0})
        for (let i = 0; i < statistics.length; i++) {
            if (statistics[i]._id == "DIRECT") {
                res[0].totalOrders = statistics[i].totalOrders
            }
            if (statistics[i]._id == "ONLINE") {
                res[1].totalOrders = statistics[i].totalOrders
            }
        }
        
        return res
    },
    async getMyOrders(ctx) {
        const query = {
            userID: ctx.request.query["userID"],
        };
        const res = await strapi
            .query("orders")
            .model.aggregate([{ $match: query }, { $sort: { createdAt: -1 } }]);
        const orders = await sanitizeEntity(res, {
            model: strapi.models.orders,
        });
        if (orders.length > 0) {
            for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
                for (let i = 0; i < orders[orderIndex].products.length; i++) {
                    const componentProduct = await strapi
                        .services['components-custom-products']
                        .findOne({ id:  Types.ObjectId(orders[orderIndex].products[i].ref)});
                    if (!componentProduct) {
                        continue
                    }
                    const product = await strapi.services['product'].findOne({
                        id: Types.ObjectId(componentProduct.productID),
                    });
                    if (product) {
                        orders[orderIndex].products[i] = {
                            productID: componentProduct.productID,
                            quantity: componentProduct.quantity,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            id: componentProduct.productID,
                        }
                    }
                }
            }
        }
        return orders
    }
};
