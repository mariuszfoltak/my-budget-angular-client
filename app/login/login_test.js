'use strict';

describe('sign in users', function () {

    var $location, $scope, $rootScope, $http;
    
    beforeEach(module('myBudget.authentication'));
    beforeEach(module('myBudget.login'));

    beforeEach(inject(function (_$controller_, _$location_, _$http_) {
        var $controller = _$controller_;
        $location = _$location_;
        $http = _$http_;
        $scope = {};
        $rootScope = {};
        $controller('LoginCtrl', {$scope: $scope, $rootScope: $rootScope});
    }));

    it('should set loggedInUser in localStorage', (function () {
        $scope.login({username: 'mariusz', password: 'test'});
        expect(localStorage["mariusz"]).toEqual('mariusz');
    }));

    it('should redirect to /main page', (function () {
        spyOn($location, 'path');
        $scope.login({username: 'mariusz', password: 'test'});
        expect($location.path).toHaveBeenCalledWith('/main');
    }));

    it('should set default authentication headers', (function () {
        spyOn($location, 'path');
        $scope.login({username: 'mariusz', password: 'test'});
        expect($http.defaults.headers.common["Authorization-User"]).toEqual("mariusz");
        expect($http.defaults.headers.common["Authorization-Password"]).toEqual("test");
    }));
});