'use strict';

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
      }
};
