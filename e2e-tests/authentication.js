'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Authentication module', function () {
    var mocks = require('./mocks');

    beforeEach(function () {
        browser.addMockModule(mocks.auth.name, mocks.auth.module);
    });

    it('should automatically redirect to /access/login when location hash/fragment is empty', function () {
        browser.get('');

        browser.sleep(500);
        expect(browser.getLocationAbsUrl()).toMatch("/access/signin");
    });

    it('should automatically redirect to /app/ui/transactions after correctly login', function () {
        browser.get('');

        element(by.model('credentials.username')).sendKeys('mariusz');
        element(by.model('credentials.password')).sendKeys('abc123');
        element(by.id('signin')).click();

        browser.sleep(500);
        expect(browser.getLocationAbsUrl()).toMatch("/app/ui/transactions");
    });
});
;