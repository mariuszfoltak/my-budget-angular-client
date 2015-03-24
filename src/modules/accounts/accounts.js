'use strict';

app

    .factory('Account', ['$resource', function ($resource) {
        return $resource("/api/v1/accounts/:name");
    }]);

app

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
;