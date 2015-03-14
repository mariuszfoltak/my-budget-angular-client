'use strict';

angular.module('myBudget.main', ['ngRoute', 'myBudget.account'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', ['$scope', 'Account', '$modal', function ($scope, Account, $modal) {

        $scope.accounts = Account.query();

        $scope.showAddAccountDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'main/addAccountModal.html',
                controller: 'ModalInstanceCtrl'
            });

            modalInstance.result.then(function () {
                $scope.accounts = Account.query();
            });
        };

    }])

    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'Account', function ($scope, $modalInstance, Account) {

        $scope.account = new Account();

        $scope.save = function (account) {
            account.$save(function () {
                $modalInstance.close();
            });
        };

        $scope.cancel = $modalInstance.dismiss;
    }])
;