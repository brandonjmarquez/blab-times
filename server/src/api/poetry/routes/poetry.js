'use strict';

/**
 * poetry router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::poetry.poetry');
