'use strict';

/**
 * recent-post service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recent-post.recent-post');
