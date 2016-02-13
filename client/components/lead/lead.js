'use strict';

angular.module('copperEventLeadsApp')
  .factory('Lead', function ($resource) {
    return $resource('/api/leads/:id/:controller', {
        id: '@_id'
      },
      {
        changePassword: {
          method: 'PUT',
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
        }
      });
  });

