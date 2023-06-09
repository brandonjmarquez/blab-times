module.exports = {
  beforeCreate(event) {
    if (event.params.data.title && event.params.data.post) {
      event.params.data.api = "storytime";
    }
  },

  beforeUpdate(event) {
    if (event.params.data.title && event.params.data.post) {
      event.params.data.api = "storytime";
    }
  },

  async afterUpdate(event) {
    try{
      if(event.result.publishedAt) {
        const addRecentPost = await strapi.entityService.create('api::recent-post.recent-post', {
          data: {
            postId: event.result.id,
            api: event.result.api,
            title: event.result.title,
            dateCreated: event.result.publishedAt,
            publishedAt: new Date(),
          }
        })

        const entries = await strapi.db.query('api::subscribed.subscribed').findMany();

        if(entries.length > 0)
          for(var i = 0; i < entries.length; i++) {
            await strapi.plugins['email'].services.email.send({
              to: entries[i].email,
              from: process.env.SMTP_USERNAME, // e.g. single sender verification in SendGrid
              subject: 'Blab Times has a new post!',
              html: `
                <h1>New Post Alert</h1>
                <p>Check it out at the link below:</p>
                <p><a href="https://blab-times.vercel.app/${event.result.api}/${event.result.id}">${event.result.title}</a></p>
                <br>
                <p><a href="https://blab-times.vercel.app/unsubscribe#${entries[i].email}">Unsubscribe</a></p>
              `,
            });
        }
      }
    } catch(err) {
        console.log(err);
    }
  }
};