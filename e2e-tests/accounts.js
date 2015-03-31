'use strict';

describe('Accounts module', function () {
    var mocks = require('./mocks');

    beforeEach(function () {
        browser.addMockModule('authMock', mocks.auth, {username: 'mariusz', password: 'abc123'});
        browser.addMockModule('httpBackendMock', mocks.accounts);
    });

    it('shows an accounts list', function () {
        browser.get('#/app/ui/transactions');
        browser.sleep(500);

        var accounts = element.all(by.repeater('account in accounts'));
        expect(accounts.count()).toBe(3);

        //check if accounts list has expected elements
        accounts.map(function (account) {
            return account.getText();
        }).then(function (accounts) {
            expect(accounts).toContain('wallet');
            expect(accounts).toContain('bank');
            expect(accounts).toContain('sock');
        });
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

    it('removing an account from list', function () {
        browser.get('#/app/ui/transactions');
        browser.sleep(500);

        //check if accounts list has three elements
        var accounts = element.all(by.repeater('account in accounts'))
        expect(accounts.count()).toBe(3);

        //FIXME: get element by name, not index
        accounts.then(function (accounts) {
            accounts[1].element(by.className('removeAccountButton')).click();
        });

        element(by.id('removeAccountButtonModal')).click();
        browser.sleep(500);

        //check if toaster is displayed
        //TODO: it would be nice, if we have tests for toaster content (type, title and message)
        expect(element(by.css('#toast-container')).isDisplayed()).toBeTruthy();

        //check if accounts list has two elements
        var accounts = element.all(by.repeater('account in accounts'));
        expect(accounts.count()).toBe(2);

        //check if accounts list doesn't contain 'wallet' account
        accounts.map(function (account) {
            return account.getText();
        }).then(function (accounts) {
            expect(accounts).not.toContain('wallet');
        });
    });
});