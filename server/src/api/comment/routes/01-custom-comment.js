'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/comments/last-minute/:id',
      handler: 'comment.lastMinute',
      config: {
        policies: []
      }
    },
  ]
}