'use strict';

angular.module('copperEventLeadsApp')
  .controller('NavbarCtrl', function ($rootScope, $scope, $location, Auth, $cookieStore) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    console.log("$cookieStore.get('token')");
    console.log($cookieStore.get('token'));

    (typeof($cookieStore.get('token')) != "undefined" && $cookieStore.get('token') != null) ? $rootScope.showRegistration = true : $rootScope.showRegistration = false;

        console.log($rootScope.showRegistration);

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
