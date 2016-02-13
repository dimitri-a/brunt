'use strict';

angular.module('copperEventLeadsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });

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

'use strict';

angular.module('copperEventLeadsApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });

'use strict';

angular.module('copperEventLeadsApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });

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

'use strict';

angular.module('copperEventLeadsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });

'use strict';

angular.module('copperEventLeadsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
          console.log("printing the token from client");
          console.log(config.headers.Authorization);
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });

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

/*
'use strict';

angular.module('copperEventLeadsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'app/lead/register.html',
        controller: 'LeadCtrl'
      });
  });
*/

'use strict';

angular.module('copperEventLeadsApp')
  .controller('MainCtrl', function ($scope, $http) {

    console.log("MainCtrl");
    //$scope.awesomeThings = [];
    //
    //$http.get('/api/things').success(function(awesomeThings) {
    //  $scope.awesomeThings = awesomeThings;
    //  socket.syncUpdates('thing', $scope.awesomeThings);
    //});
    //
    //$scope.addThing = function() {
    //  if($scope.newThing === '') {
    //    return;
    //  }
    //  $http.post('/api/things', { name: $scope.newThing });
    //  $scope.newThing = '';
    //};
    //
    //$scope.deleteThing = function(thing) {
    //  $http.delete('/api/things/' + thing._id);
    //};
    //
    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});
  });

'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('copperEventLeadsApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  });
});

'use strict';

angular.module('copperEventLeadsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });

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



'use strict';

describe('Controller: RegistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('copperEventLeadsApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  });
});

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
