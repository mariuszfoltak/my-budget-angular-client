// config

var app =
    angular.module('app')
        .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ])
        .config(['$translateProvider', function ($translateProvider) {
            // Register a loader for the static files
            // So, the module will search missing translation tables under the specified urls.
            // Those urls are [prefix][langKey][suffix].
            $translateProvider.useStaticFilesLoader({
                prefix: 'l10n/',
                suffix: '.js'
            });
            // Tell the module what language to use by default
            $translateProvider.preferredLanguage('en');
            // Tell the module to store the language in the local storage
            $translateProvider.useLocalStorage();
        }])
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('http://apimybudget-mfoltak.rhcloud.com/api/v1/');
        }])
        .run(
        ['$rootScope', '$state', '$http', 'AuthService',
            function ($rootScope, $state, $http, AuthService) {
                if (AuthService.isAuthenticated()) {
                    $http.defaults.headers.common["Authorization-User"] = AuthService.getSession().getUsername();
                    $http.defaults.headers.common["Authorization-Password"] = AuthService.getSession().getPassword();
                }
                $rootScope.$on("$stateChangeStart", function (event, next) {
                    if (!AuthService.isAuthenticated()) {
                        if (next.name !== "access.signin") {
                            event.preventDefault();
                            $state.go('access.signin');
                        }
                    }
                });
            }]);