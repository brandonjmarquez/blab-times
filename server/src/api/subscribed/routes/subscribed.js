'use strict';

/**
 * subscribed router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::subscribed.subscribed');
