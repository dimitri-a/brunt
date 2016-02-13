'use strict';

angular.module('copperEventLeadsApp')
  .factory('Event', function ($resource) {
    return $resource('/api/events/:id', {
        id: '@_id'
      },
      {
        addEvent: {
          method: 'POST',
          params: {
            controller:'password'
          }
        },
        getAll: {
          method: 'GET',
          params: {
            id:'me'
          }
        },
        get: {
          method: 'GET',
          params: {}
        },

        edit: {
          method: 'PUT',
          params: {
            id:'id'
          }
        },
      });
  });

