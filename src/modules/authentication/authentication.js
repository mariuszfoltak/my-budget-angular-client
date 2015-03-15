angular.module('app.authentication', [])

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

    .run(
    ['$rootScope', '$state', '$http', 'AuthService',
        function ($rootScope, $state, $http, AuthService) {
            if (AuthService.isAuthenticated()) {
                $http.defaults.headers.common["Authorization-User"] = AuthService.getSession().getUsername();
                $http.defaults.headers.common["Authorization-Password"] = AuthService.getSession().getPassword();
            }
            $rootScope.$on("$stateChangeStart", function (event, next) {
                if (!AuthService.isAuthenticated()) {
                    if (next.name !== "access.signin") {
                        event.preventDefault();
                        $state.go('access.signin');
                    }
                }
            });
        }])

;