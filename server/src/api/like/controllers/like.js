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
          }
        ]
      }
    });
    ctx.body = entries.length;
  },

  create: async (ctx) => {
    console.log(ctx.response)
    // const entry = await strapi.db.query("api::like.like").findOne({
    //   where: {
    //     $and: [
    //       {
    //         api: {
    //           $eq: ctx.params.api
    //         }
    //       },
    //       {
    //         postId: {
    //           $eq: ctx.params.id
    //         }
    //       },
    //       {
    //         userId: {
    //           $eq: ctx.params.userId
    //         }
    //       }
    //     ]
    //   }
    // })
    // if(entry) {
    //   ctx.body = "Post already liked."
    // } else {
      // const create = await strapi.db.query("api::like.like").create({
      //   data: {
      //     liked: ctx.params.liked,
      //     api: ctx.params.api,
      //     postId: ctx.params.postId,
      //     userId: ctx.params.userId
      //   }
      // })
    // }
  }
}));
