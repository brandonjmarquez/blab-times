'use strict';

/**
 * subscribed controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscribed.subscribed', {
  unsubscribe: async (ctx) => {
    console.log(ctx)
    
  }
});
