app.controller('CategoryController',
    ['$scope', 'Restangular', '$modal', 'toaster', function ($scope, Restangular, $modal, toaster) {

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

        that.addCategory = function (parent) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/transactions/category-create-modal.html',
                controller: 'AddCategoryModalController',
                controllerAs: 'ctrl'
            });

            modalInstance.result.then(function (category) {
                categoriesRest.post(category).then(function (category) {
                    if (parent) {
                        parent.subCategories.push(category);
                    } else {
                        that.categories.push(category);
                    }
                    toaster.pop('success', 'Dodano kategorię', 'Dodano kategorię ' + category.name);
                }, function () {
                    toaster.pop('error', 'Wystąpił błąd', 'Nie udało się dodać kategorii, gdyż wystąpił błąd');
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
