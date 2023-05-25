module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  deleteRecentPosts: {
    task: async ({ strapi }) => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      const entries = await strapi.db.query('api::recent-post.recent-post').findMany();
      for(var i = 0; i < entries.length; i++) {
        const deleteEntries = await strapi.db.query('api::recent-post.recent-post').delete({
          where: {
            id: {
              $eq: entries[i].id
            }
          }
        })
      }
      console.log(entries)
    },
    options: {
      rule: "0 0 2 * * *",
      tz: "America/Chicago",
    },
  },

  findRecentPosts: {
    task: async ({ strapi }) => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      const current = new Date();
      const monthAgo = new Date(new Date().setDate(current.getDate() - 30));
      const bookReports = await strapi.db.query('api::book-report.book-report').findMany({
        where: {
          publishedAt: {
            $gte: monthAgo.toJSON()
          }
        }
      })
      const poetries = await strapi.db.query('api::poetry.poetry').findMany({
        where: {
          publishedAt: {
            $gte: monthAgo.toJSON()
          }
        }
      })
      const storytimes = await strapi.db.query('api::storytime.storytime').findMany({
        where: {
          publishedAt: {
            $gte: monthAgo.toJSON()
          }
        }
      })
      const therapyTalks = await strapi.db.query('api::therapy-talk.therapy-talk').findMany({
        where: {
          publishedAt: {
            $gte: monthAgo.toJSON()
          }
        }
      })
      const posts = [...bookReports, ...poetries, ...storytimes, ...therapyTalks];
      let postsRevised = [];

      posts.forEach((post) => {
        let postCp = {...post};

        postCp.dateCreated = postCp.publishedAt;
        postCp.postId = postCp.id;
        delete postCp.id;
        delete postCp.post;
        delete postCp.createdAt;
        delete postCp.updatedAt;
        delete postCp.publishedAt;
        postsRevised.push(postCp);
      });
      postsRevised.forEach(async (post) => {
        const addRecentPost = await strapi.entityService.create('api::recent-post.recent-post', {
          data: {
            ...post,
            publishedAt: new Date(),
          }
        })
      });
    },
    options: {
      rule: "15 0 2 * * *",
      tz: "America/Chicago",
    },
  },
};