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

  },

  me: async (ctx) => {
    const pluralize = require('pluralize');
    const entries = await strapi.db.query("api::comment.comment").findMany({
      where: { userId: ctx.params.userId },
      orderBy: { publishedAt: 'desc' },
      offset: 1 + ctx.params.page * 10,
      limit: 10
    });
    console.log(entries, 1 + ctx.params.page * 10)
    let comments = [];
    if(entries.length > 0)
      for(var i = 0; i < entries.length; i++) {
        const post = await strapi.db.query(`api::${pluralize.singular(entries[i].api)}.${pluralize.singular(entries[i].api)}`).findOne({
          where: { id: entries[i].postId }
        });
        let entryCp = {...entries[i]}

        entryCp.title = post.title
        comments.push(entryCp);
      }

    ctx.body = comments;
  }
}));
