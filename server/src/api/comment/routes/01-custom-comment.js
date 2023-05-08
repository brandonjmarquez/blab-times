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
  ]
}