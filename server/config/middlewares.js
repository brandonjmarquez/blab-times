module.exports = [
  'strapi::errors',
  'strapi::security',
  // {
  //   name: 'strapi::security',
  //   config: {
  //     contentSecurityPolicy: {
  //       useDefaults: true,
  //       directives: {
  //         'connect-src': ["'self'", 'http:', 'https:'],
  //         upgradeInsecureRequests: null,
  //       },
  //     },
  //   },
  // },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
