module.exports = (plugin) => {
  plugin.controllers.auth.login = async (ctx) => {
    try{
      ctx.error = await strapi.controller('plugin::users-permissions.auth').callback(ctx);
    } catch(err) {
      ctx.body = err
    }
  };

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local',
    handler: 'auth.login',
    config: {
      policies: []
    }
  })

  return plugin;
};