'use strict';

module.exports = {
  routes: [
    {
      method: 'DELETE',
      path: '/subscribeds/:email',
      handler: 'subscribed.delete',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/subscribeds',
      handler: 'subscribed.create',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: 'subscribeds/:email',
      handler: 'subscribed.findOne'
    }
  ]
}