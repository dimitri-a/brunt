'use strict';

angular.module('copperEventLeadsApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Event) {

    $scope.event = {};
    $scope.user = {};

    $scope.errors = {};
    $scope.showStatus = false;
    $scope.alert = false;
    $scope.isRequired = false;
    $scope.registrationCount = 0;
    $scope.isAddUserOpen = false;
    $scope.isAddEventOpen = false;

    $scope.showAddUser = false;
    $scope.eventName = "Event Name";
    $scope.editMode = false;

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.deleteUser = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    function getEvents() {
        $http.get('/api/events').success(function(data) {
          $scope.events = data;
          //socket.syncUpdates('event', $scope.events);
        });
    };
    getEvents();

    $scope.$on('$destroy', function() {
      //socket.unsyncUpdates('event');
    });

    $scope.showUser = function(show) {
      if(show) {
        $scope.showAddUser = true;
      } else {
        $scope.showAddUser = false;
      }
    }

    $scope.generateCsv = function () {
      console.log("inside the generatecsv");
      $http.get('/api/leads/csv').success(function (leads) {
        $scope.leads = leads;
        console.log("printing the leads ", $scope.leads);
        //socket.syncUpdates('lead', $scope.leads);
      });
    }

    $scope.addEvent = function (evtForm) {
      //$scope.submitted = false;
      $scope.submitted = true;
      $scope.isRequired = true;

      console.log($scope.evtForm.$valid);
      if($scope.event.name.trim().length > 0
        && $scope.event.venue.trim().length > 0) {
          if ($scope.evtForm.$valid) {

            $scope.isRequired = false;
            $scope.submitted = false;
            $scope.editMode = false;

            $http.post('/api/events', {
              name: $scope.event.name,
              venue: $scope.event.venue
            }).then(function(){
              getEvents();
              $scope.eventName = $scope.event.name;
            }).catch( function(err) {
              err = err.data;
              $scope.errors = {};
              $scope.alert = 'error';
              // Update validity of form fields that match the mongoose errors
              angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
              });
            });
            $scope.event = {};
          }
      }
    }

    $scope.editEvent = function (eventForm) {
      $scope.editMode = false;
      if($scope.event.name.trim().length > 0
        && $scope.event.venue.trim().length > 0) {
        $scope.isRequired = false;
        $scope.submitted = false;

        $http.put('/api/events/'+($scope.event._id), {
          name: $scope.event.name,
          venue: $scope.event.venue
        }).then(function(){
          getEvents();
          //$scope.eventName = $scope.event.name;
        }).catch( function(err) {
          err = err.data;
          $scope.errors = {};
          $scope.alert = 'error';
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
        $scope.event = {};
      }

    }

    $scope.showEditEvent= function (event) {
      $scope.editMode = true;
      console.log(event);
      $scope.event = event;
    }

    $scope.deleteEvent = function (event) {
      $http.delete('/api/events/' + event._id);
      getEvents();
    }

    $scope.resetEvent = function(evtForm) {
      $scope.isRequired = false;
      $scope.submitted = false;
      $scope.event = {};
    }

    $scope.showEditUser = function(user) {
      $scope.editMode = true;
      console.log(user);
      $scope.user = user;
    }



    $scope.generateCsv = function() {
      console.log("inside the generatecsv");
      $http.get('/api/leads/csv').success(function(leads) {
        $scope.leads = leads;
        console.log("printing the leads ", $scope.leads);
        //socket.syncUpdates('lead', $scope.leads);
      });
    }

    $scope.addUser = function (userForm) {
      $scope.submitted = true;

      $scope.submitted = true;
      $scope.isRequired = true;

      if(userForm.$valid) {
        //$scope.isRequired = false;
        //$scope.submitted = false;

        Auth.createAndRefreshUser({
            name: $scope.user.name,
            event: $scope.user.event,
            email: $scope.user.email,
            password: $scope.user.password
          })
          .then( function(users) {
            //console.log("users", users);
            $scope.users = User.query();
          })
          .catch( function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              userForm[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
        //$scope.user = {};
      }
    }

    function invalidateFormControls(userForm) {
      var defaultForm = {
        username : "",
        event: "",
        email : "",
        password : ""
      }
      console.log("printing the invalid form..");
      userForm.$dirty = false;
      userForm.$submitted = false;
      $scope.user = angular.copy(defaultForm);

      userForm.$setPristine();
      userForm.$setUntouched();

      userForm.username.$valid = false;
      userForm.username.$error.required = false;

      userForm.password.$valid = false;
      userForm.password.$error.required = false;
      userForm.password.$error.minlength = false;

      $scope.userForm.$setPristine();
      userForm.$setPristine();
    }

    $scope.resetUser = function (userForm) {
      $scope.user = {};
      userForm.$dirty = false;
      userForm.$submitted = false;
      userForm.$setPristine();
      userForm.$setUntouched();
      //invalidateFormControls(userForm);
    }
  });
