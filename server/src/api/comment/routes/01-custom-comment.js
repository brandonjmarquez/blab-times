'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/comments/last-minute/:userId',
      handler: 'comment.lastMinute',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/comments/get-comments/:api/:postId',
      handler: 'comment.getComments',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/comments/:id',
      handler: 'comment.delete',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/comments/me/:page',
      handler: 'comment.me',
      config: {
        policies: []
      }
    }
  ]
}