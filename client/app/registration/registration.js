'use strict';

angular.module('copperEventLeadsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('registration', {
        url: '/registration',
        templateUrl: 'app/registration/registration.html',
        controller: 'RegistrationCtrl'
      });
  });
