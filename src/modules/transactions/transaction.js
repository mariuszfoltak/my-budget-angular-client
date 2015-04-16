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

app.factory('Category', ['$resource', function ($resource) {
    return $resource("http://apimybudget-mfoltak.rhcloud.com/api/v1/categories/:id", {id: '@id'});
}]);

app.controller('CategoryController', ['$scope', 'Restangular', '$modal', 'toaster', function ($scope, Restangular, $modal, toaster) {
    var that = this;
    that.categories = [];

    var categoriesRest = Restangular.all('categories');

    categoriesRest.getList().then(function (categories) {
        that.categories = categories;
        that.categories.forEach(function (category) {
            category.subCategories = [];
            category.getList('category').then(function (subCategories) {
                category.subCategories = subCategories;
            });
        });
    });

    that.getSubItems = function (category) {
        return category.subCategories;
    };

    that.removeCategory = function (category, parent) {
        var modalInstance = $modal.open({
            templateUrl: 'modules/transactions/confirmation-modal.html',
            controller: 'RemoveCategoryModalController',
            controllerAs: 'ctrl'
        });

        modalInstance.result.then(function () {
            category.remove().then(function () {
                if (parent) {
                    console.log("Usuwam z parenta");
                    parent.subCategories = _.without(parent.subCategories, category);
                } else {
                    that.categories = _.without(that.categories, category);
                }
                // FIXME: add a title and body of toaster
                toaster.pop('success', 'title', 'body');
            }, function () {
                // FIXME: add a title and body of toaster
                toaster.pop('error', 'title', 'body');
            });
        });
    };

    that.addCategory = function () {
        var modalInstance = $modal.open({
            templateUrl: 'modules/transactions/category-create-modal.html',
            controller: 'AddCategoryModalController',
            controllerAs: 'ctrl'
        });

        modalInstance.result.then(function (category) {
            categoriesRest.post(category).then(function (category) {
                that.categories.push(category);
                toaster.pop('success', 'Dodano kategorię', 'Dodano kategorię ' + category.name);
            }, function () {
                toaster.pop('error', 'Wystąpił błąd', 'Nie udało się dodać kategorii, gdyż wystąpił błąd' + category.name);
            });
        });
    };
}]);

app.controller('RemoveCategoryModalController', ['$modalInstance', function ($modalInstance) {
    this.getTitle = function () {
        return 'Czy na pewno chcesz usunąc tą kategorię?'
    };
    this.accept = $modalInstance.close;
    this.cancel = $modalInstance.dismiss;
}]);

app.controller('AddCategoryModalController', ['$modalInstance', function ($modalInstance) {
    this.getTitle = function () {
        return 'Dodaj kategorię'
    };
    this.accept = function (category) {
        $modalInstance.close(category);
    };
    this.cancel = $modalInstance.dismiss;
}]);

