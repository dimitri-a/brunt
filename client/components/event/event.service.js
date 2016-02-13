'use strict';

angular.module('copperEventLeadsApp')
  .factory('LeadService', function Auth($location, $rootScope, $http, Lead, $cookieStore, $q) {
    return {
      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createLead: function(lead, callback) {
        var cb = callback || angular.noop;

        return Lead.save(lead,
          function(data) {
            return cb(lead);
          },
          function(err) {

            return cb(err);
          }.bind(this)).$promise;
      },

    };
  });
