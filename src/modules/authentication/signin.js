'use strict';

app
    .controller('LoginCtrl', ['$scope', '$http', '$state', 'AuthService',
        function ($scope, $http, $state, AuthService) {
            $scope.credentials = {
                username: '',
                password: ''
            };
            $scope.login = function (credentials) {
                AuthService.login(credentials);
                $http.defaults.headers.common["Authorization-User"] = credentials.username;
                $http.defaults.headers.common["Authorization-Password"] = credentials.password;
                $state.go('app.ui.transactions');
            };
        }])
;