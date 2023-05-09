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
            userId: {
              $eq: ctx.params.userId
            }
          }
        ]
      }
    });
    ctx.body = entry;
  },

  getComments: async (ctx) => {
    const entries = await strapi.db.query("api::comment.comment").findMany({
      where: {
        $and: [
          {
            api: {
              $eq: ctx.params.api
            },
          },
          {
            postId: {
              $eq: ctx.params.postId
            }
          }
        ]
      },
      populate: true
    });
    ctx.body = entries;
  },

  delete: async (ctx) => {

  }
}));
