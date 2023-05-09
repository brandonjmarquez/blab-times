module.exports = {
  async beforeCreate(event) {
    if(event.params.data.userId) {
      const entry = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { 
          id: {
            $eq: event.params.data.userId
          }
        }
      })

      event.params.data.username = entry.username;
    }
  }
}