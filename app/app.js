'use strict';

// Declare app level module which depends on views, and components
angular.module('myBudget', [
    'ngRoute',
    'ui.bootstrap',
    'myBudget.main',
    'myBudget.login',
    'myBudget.authentication'
])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/main'});
        }])
    .run(function ($rootScope, $location, $http, AuthService, Session) {
        if (AuthService.isAuthenticated()) {
            $http.defaults.headers.common["Authorization-User"] = Session.getUsername();
            $http.defaults.headers.common["Authorization-Password"] = Session.getPassword();
        }
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (!AuthService.isAuthenticated()) {
                if (next.templateUrl !== "login/login.html") {
                    $location.path("/login");
                }
            }
        });
    });
3