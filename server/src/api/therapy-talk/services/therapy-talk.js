'use strict';

/**
 * therapy-talk service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::therapy-talk.therapy-talk');
