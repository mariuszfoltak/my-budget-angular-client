exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'mocks.js',
        'authentication.js',
        'accounts.js',
        'categories.js',
    ],

    capabilities: {
        'browserName': 'firefox'
    },

    baseUrl: 'http://localhost:8000/src/',

    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        print: function () {
        }
    },

    onPrepare: function () {
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));
    }
};
