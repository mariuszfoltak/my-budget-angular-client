'use strict';

angular.module('myBudget.main', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/main', {
                    templateUrl: 'main/main.html',
                    controller: 'MainCtrl'
                });
            }])

        .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
                $http.get('http://localhost:8080/api/v1/accounts').success(function (data, status) {
                    $scope.accounts = data;
                });
            }]);