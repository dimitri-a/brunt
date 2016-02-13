'use strict';

angular.module('copperEventLeadsApp')
  .controller('RegistrationCtrl', function ($rootScope, $scope, Auth, User,
                                            LeadService, $timeout, $http, $location, socket) {

    $scope.leads = [];
    //$scope.showRegistration = false;
    $scope.lead = {};
    $scope.errors = {};
    $scope.showStatus = false;
    $scope.alert = '';
    $scope.isRequired = false;
    $scope.registrationCount = 0;
    $scope.lead.dob = new Date();
    $scope.lead.consent = false;

    User.get().$promise.then(function(loggedinUser){
      $scope.user = loggedinUser;
      $scope.eventName = $scope.user.event;
    });

    $http.get('/api/leads').success(function(leads) {
      console.log("printing the leads ", $scope.leads);
      socket.syncUpdates('lead', $scope.leads);
      $timeout(function()
      {
        $scope.$apply(function () {
          $scope.leads = leads;
          $scope.registrationCount = leads.length;
        });
      });
    });

    $scope.showLeadTable = function() {
      $http.get('/api/leads').success(function(leads) {

        console.log("printing the leads ", $scope.leads);
        socket.syncUpdates('lead', $scope.leads);
        $timeout(function()
        {
          $scope.$apply(function () {
            $scope.leads = leads;
            $scope.registrationCount = leads.length;
          });
        });
      });
      //$scope.showRegistration = false;
    }

    $scope.generateCsv = function() {
      console.log("inside the generatecsv");
      $http.get('/api/leads/csv').success(function(leads) {
        $scope.leads = leads;
        console.log("printing the leads ", $scope.leads);
        socket.syncUpdates('lead', $scope.leads);
      });
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
        if($scope.newThing === '') {
          return;
        }
        $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    function invalidateFormControls(regForm) {
      var defaultForm = {
        name : "",
        dob : "",
        address : "",
        phone : "",
        mobile : "",
        email : "",
        password : "",
        note: "",
        consent: false
      }
      console.log("printing the invalid form..");
      regForm.$dirty = false;
      regForm.$submitted = false;
      $scope.lead = angular.copy(defaultForm);
      $scope.showStatus = false;
      regForm.$setPristine();
      regForm.$setUntouched();

      regForm.name.$valid = false;
      regForm.name.$error.required = false;
    }

    $scope.reset = function (regForm) {
      $scope.lead = {};
      $scope.isRequired = false;

      $scope.alert = '';
      $scope.showStatus = false;
      invalidateFormControls(regForm);
      $scope.lead.dob = new Date();
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    var setAllInactive = function() {
      angular.forEach($scope.workspaces, function(workspace) {
        workspace.active = false;
      });
    };

    var addNewWorkspace = function(name) {
      var id = $scope.workspaces.length + 1;
      $scope.workspaces.push({
        id: id,
        name: name,
        active: true
      });
    };

    $scope.workspaces =
      [
        { id: 1, name: "Home", active:true  }

      ];
    //,{ id: 2, name: "Workspace 2", active:false }

    $scope.addWorkspace = function (name) {
      setAllInactive();
      addNewWorkspace(name);
    };

    $scope.registerLeads = function(regForm) {
      $scope.submitted = true;
      $scope.isRequired = true;
      if($scope.lead.name.trim().length > 0
        && $scope.lead.address.trim().length > 0
        && $scope.lead.phone.trim().length > 0
        && $scope.lead.mobile.trim().length > 0
        && $scope.lead.email.trim().length > 0
        && $scope.lead.note.trim().length > 0) {

        if(regForm.$valid) {
          LeadService.createLead({
              name: $scope.lead.name,
              address: $scope.lead.address,
              dob: $scope.lead.dob,
              phone: $scope.lead.phone,
              mobile: $scope.lead.mobile,
              email: $scope.lead.email,
              note: $scope.lead.note,
              consent: $scope.lead.consent
            })
            .then( function(data) {
              // Account created, redirect to home
              //$rootScope.showRegistration = true;
              $scope.alert = 'Save successful';

              $scope.showStatus = true;
              $http.get('/api/leads').success(function(leads) {

                console.log("printing the leads ", $scope.leads);
                socket.syncUpdates('lead', $scope.leads);

                $timeout(function()
                {
                  $scope.$apply(function () {
                    $scope.leads = leads;
                    $scope.registrationCount = leads.length;


                  });
                });

              });

            })
            .catch( function(err) {
              err = err.data;
              $scope.errors = {};
              $scope.alert = 'error';
              // Update validity of form fields that match the mongoose errors
              angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
              });
            });
        }

      }
    };
});


