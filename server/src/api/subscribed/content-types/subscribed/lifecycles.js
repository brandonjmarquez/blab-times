module.exports = {
  async beforeCreate(event) {
    const entry = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        email: {
          $eq: event.params.data.email
        }
      }
    });
    const subscribe = await strapi.db.query('plugin::users-permissions.user').update({
      where: { email: event.params.data.email },
      data: { subscribed: true }
    })
  },
}