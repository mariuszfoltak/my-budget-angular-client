angular.module('app.authentication', [])

    .service('Session', function () {
        this.create = function (username, password) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
        };
        this.destroy = function () {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        };
        this.getUsername = function () {
            return localStorage.getItem("username");
        };
        this.getPassword = function () {
            return localStorage.getItem("password");
        };
    })

    .factory('AuthService', ['$http', 'Session', function ($http, Session) {
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

        authService.getSession = function ()  {
            return Session;
        };

        return authService;
    }])

;