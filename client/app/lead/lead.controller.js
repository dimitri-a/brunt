'use strict';

angular.module('copperEventLeadsApp')
    .controller('LeadCtrl', function ($rootScope, $scope, Auth, LeadService, $location, $timeout) {
        $scope.lead = {};
        $scope.errors = {};
        $scope.showStatus = false;
        $scope.alert = false;

        $scope.isRequired = false;

        function invalidateFormControls(regForm) {
          var defaultForm = {
            name : "",
            address : "",
            phone : "",
            mobile : "",
            email : "",
            password : ""
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


          /*  var defaultForm = {
            name : "",
            address : "",
            phone : "",
            mobile : "",
            email : "",
            password : ""
          }
          $scope.isRequired = false;
          $timeout(function() {

            if(regForm.$valid) {
              console.log("printing the invalid form..");
              regForm.$dirty = false;
              regForm.$submitted = false;
              $scope.lead = angular.copy(defaultForm);
              $scope.showStatus = false;
              regForm.$setPristine();
              regForm.$setUntouched();

              regForm.name.$valid = true;
              regForm.name.$error.required = false;
            }

            /!*regForm.$setValidity(regForm.phone.$valid, true);
            regForm.$setValidity(regForm.phone.$valid, true);
            regForm.$setValidity(regForm.phone.$valid, true);
            regForm.$setValidity(regForm.phone.$valid, true);
            regForm.$setValidity(regForm.phone.$valid, true);


            regForm.$setValidity(regForm.name.$error.required, false);
            regForm.$setValidity(regForm.address.$error.required, false);
            regForm.$setValidity(regForm.phone.$error.required, false);
            regForm.$setValidity(regForm.mobile.$error.required, false);
            regForm.$setValidity(regForm.email.$error.required, false);*!/

            $location.path('/register');
          });*/
        }

        $scope.registerLeads = function(regForm) {
            $scope.submitted = true;
          $scope.isRequired = true;
            if(regForm.$valid) {
              LeadService.createLead({
                    name: $scope.lead.name,
                    address: $scope.lead.address,
                    phone: $scope.lead.phone,
                    mobile: $scope.lead.mobile,
                    email: $scope.lead.email,
                    password: $scope.lead.password
                })
                .then( function(data) {
                    // Account created, redirect to home
                    //$rootScope.showRegistration = true;
                  $scope.alert = 'success';
                  $scope.showStatus = true;


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
        };


    });
