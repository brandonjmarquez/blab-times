'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/likes/count-likes/:api/:id',
      handler: 'like.countLikes',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/likes',
      handler: 'like.create',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/likes',
      handler: 'like.update',
      config: {
        policies: []
      }
    }
  ]
}