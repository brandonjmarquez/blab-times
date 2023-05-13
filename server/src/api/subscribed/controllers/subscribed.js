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
    }).then(() => ctx.body = "Successfully unsubscribed.");

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
    const entries = await strapi.db.query("api::subscribed.subscribed").create({
      data: { email: ctx.request.body.data.email, publishedAt: new Date() },
    }).then(() => ctx.body = "Successfully subscribed.");

    if(user) {
      const unsubscribe = await strapi.db.query("plugin::users-permissions.user").update({
        where: { email: ctx.request.body.data.email },
        data: { subscribed: true }
      });
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
