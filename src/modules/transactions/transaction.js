'use strict';

app.factory('Account', ['$resource', function ($resource) {
    return $resource("http://apimybudget-mfoltak.rhcloud.com/api/v1/accounts/:id", {id: '@id'});
}]);

app.controller('AccountController', ['$scope', 'Account', '$modal', 'toaster', function ($scope, Account, $modal, toaster) {

    $scope.accounts = Account.query();

    $scope.showAddAccountDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'modules/transactions/account_create_modal.html',
            controller: 'CreateAccountModalController'
        });

        modalInstance.result.then(function () {
            toaster.pop('success', 'Title', 'Body');
            Account.query(function (data) {
                $scope.accounts = data;
            });
        });
    };

    $scope.showRemoveConfirmation = function (account) {
        var modalInstance = $modal.open({
            templateUrl: 'modules/transactions/account_remove_modal.html',
            controller: 'RemoveAccountModalController',
            resolve: {
                account: function () {
                    return account;
                }
            }
        });

        modalInstance.result.then(function () {
            toaster.pop('success', 'Title', 'Body');
            Account.query(function (data) {
                $scope.accounts = data;
            });
        });
    }

}]);

app.controller('RemoveAccountModalController', ['$scope', '$modalInstance', 'account', function ($scope, $modalInstance, account) {

    $scope.delete = function () {
        account.$remove(function () {
            $modalInstance.close();
        });
    };

    $scope.cancel = $modalInstance.dismiss;
}]);

app.controller('CreateAccountModalController', ['$scope', '$modalInstance', 'Account', function ($scope, $modalInstance, Account) {

    $scope.account = new Account();

    $scope.save = function (account) {
        account.$save(function () {
            $modalInstance.close();
        });
    };

    $scope.cancel = $modalInstance.dismiss;
}]);