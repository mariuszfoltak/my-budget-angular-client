'use strict';

module.exports.accounts = {
    name: 'httpBackendMock',
    module: function () {
        angular.module('httpBackendMock', ['app', 'ngMockE2E'])
            .run(function ($httpBackend) {

                var i = 0, accounts = [];
                accounts.push({id: ++i, name: 'bank'});
                accounts.push({id: ++i, name: 'wallet'});
                accounts.push({id: ++i, name: 'sock'});

                $httpBackend.whenGET(/.*\.(js|tpl|html)/).passThrough();

                $httpBackend.whenGET(/accounts/).respond(accounts);

                $httpBackend.whenPOST(/accounts/).respond(function (method, url, jsonData) {
                    data = JSON.parse(jsonData);
                    accounts.push({id: i++, name: data.name});
                    return [201];
                });

                $httpBackend.whenDELETE(/accounts/).respond(function (method, url) {
                    var accountId = url.split('/').pop();
                    var index;
                    for (index = 0; index < accounts.length; ++index) {
                        if (accounts[index].id == accountId) {
                            break;
                        }
                    }
                    accounts.splice(index, 1);
                    return [200];
                });
            });
    }
};


module.exports.categories = {
    name: 'categoryApiMock',
    module: function () {
        angular.module('categoryApiMock', ['app', 'ngMockE2E'])
            .run(function ($httpBackend) {

                var i = 0, categories = [];
                categories.push({
                    id: 1, name: 'food',
                    subCategories: [
                        {id: 101, name: 'candies'},
                        {id: 3, name: 'vegetables'}
                    ]
                });
                categories.push({id: 4, name: 'house'});
                categories.push({id: 100, name: 'car'});

                $httpBackend.whenGET(/.*\.(js|tpl|html)/).passThrough();

                $httpBackend.whenGET(/categories$/).respond(categories);

                $httpBackend.whenGET(/categories\/1\/category$/).respond(categories[0].subCategories);

                $httpBackend.whenGET(/categories\/\d+\/category$/).respond([]);

                $httpBackend.whenPOST(/categories/).respond(function (method, url, jsonData) {
                    data = JSON.parse(jsonData);
                    if (data.name.indexOf('error') > -1) {
                        return [500];
                    }
                    return [201, {id: ++i, name: data.name}];
                });

                $httpBackend.whenDELETE(/categories/).respond(function (method, url, jsonData) {
                    console.log(url);
                    var categoryId = url.split('/').pop();
                    if (categoryId > 99) return [503];
                    return [200];
                });
            });
    }
};

module.exports.auth = {
    name: 'authMock',
    module: function (mockAuthData) {
        angular.module('authMock', [])
            .run(function () {
                if (mockAuthData) {
                    localStorage.setItem("username", mockAuthData.username);
                    localStorage.setItem("password", mockAuthData.password);
                } else {
                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                }
            });
    }
};