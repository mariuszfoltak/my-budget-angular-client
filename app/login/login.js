'use strict';

angular.module('myBudget.login', ['ngRoute', 'myBudget.authentication'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/login', {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl'
                });
            }])

        .controller('LoginCtrl', function ($scope, $location, $http, AuthService) {
            $scope.credentials = {
                username: '',
                password: ''
            };
            $scope.login = function (credentials) {
                AuthService.login(credentials);
                $http.defaults.headers.common["Authorization-User"] = credentials.username;
                $http.defaults.headers.common["Authorization-Password"] = credentials.password;
                $location.path("/main");
            };
        });