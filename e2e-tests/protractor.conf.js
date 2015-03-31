exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'mocks.js',
        'authentication.js',
        'accounts.js',
    ],

    capabilities: {
        'browserName': 'firefox'
    },

    baseUrl: 'http://localhost:8000/src/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
