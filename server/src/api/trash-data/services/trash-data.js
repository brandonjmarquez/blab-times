'use strict';

/**
 * trash-data service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::trash-data.trash-data');
