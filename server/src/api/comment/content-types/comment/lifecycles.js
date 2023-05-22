

module.exports = {
  async beforeCreate(event) {
    if(event.params.data.userId) {
      const entry = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { 
          id: {
            $eq: event.params.data.userId
          }
        }
      });

      event.params.data.username = entry.username;
    }
  },

  async afterCreate(event) {    // Connected to "Save" button in admin panel
    try{
      const entries = await strapi.db.query(`api::${event.params.data.api}.${event.params.data.api}`).findOne({
        postId: event.params.data.postId
      })
      await strapi.plugins['email'].services.email.send({
        to: 'blabtimes@gmail.com',
        from: process.env.SMTP_USERNAME, // e.g. single sender verification in SendGrid
        subject: `New Comment on ${entries.title}`,
        html: `
        <h1>New Comment</h1>
        <p><a href="https://blab-times.vercel.app/${entries.api}/${entries.id}">${entries.title}</a></p>
        <p style="font-weight: bold;">Comment from ${event.params.data.username}</p>
        <p>${event.params.data.comment}</p>
        `,
      });
    } catch(err) {
        console.log(err);
    }
  }
}