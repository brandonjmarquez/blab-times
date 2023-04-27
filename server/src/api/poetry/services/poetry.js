'use strict';

/**
 * poetry service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::poetry.poetry');
