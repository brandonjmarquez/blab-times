'use strict';

/**
 * subscribed controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscribed.subscribed', {
  delete: async (ctx) => {
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
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email: ctx.request.body.data.email }
    });
    const subscriber = await strapi.db.query("api::subscribed.subscribed").findOne({
      where: { email: ctx.request.body.data.email }
    });
    console.log(subscriber)
    if(user) {
      if(!user.subscribed && !subscriber) {
        const createSubscribe = await strapi.db.query("api::subscribed.subscribed").create({
          data: { email: ctx.request.body.data.email, publishedAt: new Date() },
        }).then(() => ctx.body = "Email successfully subscribed!");
    
        const subscribe = await strapi.db.query("plugin::users-permissions.user").update({
          where: { email: ctx.request.body.data.email },
          data: { subscribed: true }
        });
      } else {
        ctx.body = "Email already subscribed.";
      }
    } else if(!subscriber) {
        if(validateEmail(ctx.request.body.data.email.length)) {
          ctx.body = "Please enter a valid email."
        } else {
          const createSubscribe = await strapi.db.query("api::subscribed.subscribed").create({
            data: { email: ctx.request.body.data.email, publishedAt: new Date() },
          }).then(() => ctx.body = "Email successfully subscribed!");
        }
    } else {
      ctx.body = "Email already subscribed."
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
