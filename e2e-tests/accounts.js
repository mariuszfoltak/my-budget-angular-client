'use strict';

describe('Accounts module', function () {
    var mocks = require('./mocks');

    beforeEach(function () {
        browser.addMockModule('authMock', mocks.auth, {username: 'mariusz', password: 'abc123'});
        browser.addMockModule('httpBackendMock', mocks.accounts);
    });

    it('adding an account to list', function () {
        browser.get('#/app/ui/transactions');

        browser.sleep(500);
        var accountList = element.all(by.repeater('account in accounts'));
        expect(accountList.count()).toBe(3);

        element(by.id('addAccountButton')).click();
        element(by.model('account.name')).sendKeys('piggybank');
        element(by.id('saveAccountButtonModal')).click();
        browser.sleep(500);

        //check if toaster is displayed
        //TODO: it would be nice, if we have tests for toaster content
        expect(element(by.css('#toast-container')).isDisplayed()).toBeTruthy();

        //check if accounts list contains new element
        var accountList = element.all(by.repeater('account in accounts'));
        expect(accountList.count()).toBe(4);
    });
});