'use strict';

/**
 * comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::comment.comment', ({ strapi }) => ({
  lastMinute: async (ctx) => {
    const current = new Date();
    const minuteAgo = new Date(current.valueOf() - 60000);
    const entry = await strapi.db.query("api::comment.comment").findOne({
      where: {
        $and: [
          {
            publishedAt: {
              $gte: minuteAgo.toJSON()
            },
          },
          {
            users_permissions_user: {
              id: {
                $eq: ctx.params.id
              }
            }
          }
        ]
      }
    });
    ctx.body = entry;
  }
}));
