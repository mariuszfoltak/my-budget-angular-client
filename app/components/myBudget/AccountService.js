'use strict';

angular.module('myBudget.account', ['ngResource'])

    .factory('Account', ['$resource', function ($resource) {
        return $resource("/api/v1/accounts/:name");
    }]);