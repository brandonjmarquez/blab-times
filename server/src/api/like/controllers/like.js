'use strict';

/**
 * like controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::like.like', ({ strapi }) => ({
  countLikes: async (ctx) => {
    const entries = await strapi.db.query("api::like.like").findMany({
      where: {
        $and: [
          {
            api: {
              $eq: ctx.params.api
            },
          },
          {
            postId: {
              $eq: ctx.params.id
            }
          },
          {
            liked: {
              $eq: true
            }
          }
        ]
      }
    });
    ctx.body = entries.length;
  },

  create: async (ctx) => {
    const { body } = ctx.request;
    const entry = await strapi.db.query("api::like.like").findOne({
      where: {
        $and: [
          {
            api: {
              $eq: body.api
            }
          },
          {
            postId: {
              $eq: body.postId
            }
          },
          {
            userId: {
              $eq: body.userId
            }
          },
        ]
      }
    });

    if(entry) {
      ctx.body = "Post already liked."
    } else {
      const create = await strapi.db.query("api::like.like").create({
        data: {
          liked: body.liked,
          postId: body.postId,
          userId: body.userId,
          api: body.api,
          publishedAt: new Date(),
        }
      })
      ctx.body = "Successfully liked."
    }
  },

  update: async (ctx) => {
    const { body } = ctx.request;
    const entry = await strapi.db.query("api::like.like").findOne({
      where: {
        $and: [
          {
            api: {
              $eq: body.api
            }
          },
          {
            postId: {
              $eq: body.postId
            }
          },
          {
            userId: {
              $eq: body.userId
            }
          },
        ]
      }
    });

    if(entry) {
      const update = await strapi.db.query("api::like.like").update({
        where: { id: entry.id },
        data: {
          liked: body.liked,
          // api: entry.api,
          // postId: entry.postId,
          // userId: entry.userId,
          // username: entry.username,
          publishedAt: new Date(),
        }
      });
      ctx.body = "Successfully changed liked."
    } else {
      ctx.body = "An error occurred."
    }
  },

  me: async (ctx) => {
    const pluralize = require('pluralize');
    const decodedJwt = require('jwt-decode')(ctx.request.header.authorization.replace("Bearer ", ""));
    const entries = await strapi.db.query("api::like.like").findMany({
      where: { userId: decodedJwt.id },
      orderBy: { publishedAt: 'desc' },
      offset: 0 + ctx.params.page * 10,
      limit: 10
    })
    let likes = [];

    if(entries.length > 0) {
      for(var i = 0; i < entries.length; i++) {
        const post = await strapi.db.query(`api::${pluralize.singular(entries[i].api)}.${pluralize.singular(entries[i].api)}`).findOne({
          where: { id: entries[i].postId }
        });
        let entryCp = {...entries[i]}
        entryCp.title = post.title
        likes.push(entryCp);
      }
    }
    ctx.body = likes;
  }
}));
