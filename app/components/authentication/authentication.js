'use strict';

angular.module('myBudget.authentication', [])

    .service('Session', function () {
        this.create = function (username, password) {
            localStorage["username"] = username;
            localStorage["password"] = password;
        };
        this.destroy = function () {
            localStorage["username"] = null;
            localStorage["password"] = null;
        };
        this.getUsername = function () {
            return localStorage["username"];
        };
        this.getPassword = function () {
            return localStorage["password"];
        };
    })

    .factory('AuthService', function ($http, Session) {
        var authService = {};

        authService.login = function (credentials) {
            Session.create(credentials.username, credentials.password);
            $http.defaults.headers.common["Authorization-User"] = credentials.username;
            $http.defaults.headers.common["Authorization-Password"] = credentials.password;
        };

        authService.logout = function () {
            Session.destroy();
        };

        authService.isAuthenticated = function () {
            return !!Session.getUsername();
        };

        return authService;
    });