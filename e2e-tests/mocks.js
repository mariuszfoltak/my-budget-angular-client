'use strict';

module.exports.accounts = function () {
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

            $httpBackend.whenDELETE(/accounts/).respond(function(method, url){
                var accountId = url.split('/').pop();
                var index;
                for (index = 0; index < accounts.length; ++index) {
                    if(accounts[index].id == accountId) {
                        break;
                    }
                }
                accounts.splice(index, 1);
                return [200];
            });
        });
}

module.exports.auth = function (mockAuthData) {
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