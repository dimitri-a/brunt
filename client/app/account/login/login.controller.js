'use strict';

angular.module('copperEventLeadsApp')
  .controller('LoginCtrl', function ($rootScope, $scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function(data) {
          // Logged in, redirect to home
          //if(data.role === "admin") {
          //  $location.path('/admin');
          //} else {
          //  $location.path('/registration');
          //}
          $rootScope.loggedInUser = data.user;
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
