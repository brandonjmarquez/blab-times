'use strict';

/**
 * subscribed controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscribed.subscribed', {
  delete: async (ctx) => {
    console.log(ctx)
    const entry = await strapi.db.query("api::subscribed.subscribed").findOne({
      where: { 
        email: ctx.params.email
      }
    });
    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email: ctx.params.email }
    })
    const entries = await strapi.db.query("api::subscribed.subscribed").delete({
      where: { id: entry.id },
    }).then(() => ctx.body = "Email successfully unsubscribed.");

    if(user) {
      const unsubscribe = await strapi.db.query("plugin::users-permissions.user").update({
        where: { email: ctx.params.email },
        data: { subscribed: false }
      });
    }
  },

  create: async (ctx) => {
    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email: ctx.request.body.data.email }
    });
    const subscriber = await strapi.db.query("api::subscribed.subscribed").findOne({
      where: { email: ctx.request.body.data.email }
    })
    if(user) {
      if(!user.subscribed && !subscriber) {
        console.log(user.subscribed)
        const createSubscribe = await strapi.db.query("api::subscribed.subscribed").create({
          data: { email: ctx.request.body.data.email, publishedAt: new Date() },
        }).then(() => ctx.body = "Email successfully subscribed!");
    
        if(user) {
          const subscribe = await strapi.db.query("plugin::users-permissions.user").update({
            where: { email: ctx.request.body.data.email },
            data: { subscribed: true }
          });
        }
      } else {
        ctx.body = "Email already subscribed.";
      }
    } else {
      ctx.body = "Please input a valid email."
    }
  },

  findOne: async (ctx) => {
    const entry = await strapi.db.query("api::subscribed.subscribed").findOne({
      where: { email: ctx.params.id }
    });

    if(entry)
      ctx.body = true;
    else 
      ctx.body = false;
  }
});
