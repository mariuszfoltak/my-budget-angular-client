'use strict';

describe('Categories module', function () {
    var mocks = require('./mocks');

    beforeEach(function () {
        browser.addMockModule(mocks.auth.name, mocks.auth.module, {username: 'mariusz', password: 'abc123'});
        browser.addMockModule(mocks.accounts.name, mocks.accounts.module);
        browser.addMockModule(mocks.categories.name, mocks.categories.module);
    });

    describe('showing a categories list', function () {

        it('shows a categories list', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            var categories = element.all(by.repeater('category in ctrl.categories'));
            expect(categories.count()).toBe(3);

            //check if categories list has expected elements
            categories.map(function (category) {
                return category.getText();
            }).then(function (categories) {
                expect(categories).toContain('food');
                expect(categories).toContain('house');
                expect(categories).toContain('car');
            });
        });

        it('shows a sub categories list', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element.all(by.repeater('category in ctrl.categories')).then(function (categories) {
                categories[0].element(by.className('list-group-item')).click();
                var subCategories = categories[0].all(by.repeater('subCategory in category.subCategories'));
                expect(subCategories.count()).toBe(2);

                //check if subCategories list has expected elements
                subCategories.map(function (subCategory) {
                    return subCategory.getText();
                }).then(function (subCategories) {
                    expect(subCategories).toContain('candies');
                    expect(subCategories).toContain('vegetables');
                });
            });

        });
    });

    describe('removing a category from list', function () {

        it('removes a category from list', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            var categories = element.all(by.repeater('category in ctrl.categories'));

            //FIXME: get element by name, not index
            categories.then(function (categories) {
                categories[1].element(by.className('removeButton')).click();
            });

            element(by.id('confirmation-modal')).element(by.id('btn-accept')).click();
            browser.sleep(500);

            expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();

            //check if toaster is displayed
            //TODO: it would be nice, if we have tests for toaster content (type, title and message)
            expect(element(by.css('#toast-container')).isDisplayed()).toBeTruthy();

            var categories = element.all(by.repeater('category in ctrl.categories'));
            expect(categories.count()).toBe(2);

            categories.map(function (category) {
                return category.getText();
            }).then(function (categoriesNames) {
                expect(categoriesNames).not.toContain('house');
            });
        });

        it('does not remove a category when operation is not been confirmed', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            var categories = element.all(by.repeater('category in ctrl.categories'));

            //FIXME: get element by name, not index
            categories.then(function (categories) {
                categories[1].element(by.className('removeButton')).click();
            });

            element(by.id('confirmation-modal')).element(by.id('btn-decline')).click();
            browser.sleep(500);

            expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();
            expect(element.all(by.repeater('category in ctrl.categories')).count()).toBe(3);
        });

        it('shows error message when api returns an exception', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            var categories = element.all(by.repeater('category in ctrl.categories'));

            //FIXME: get element by name, not index
            categories.then(function (categories) {
                categories[2].element(by.className('removeButton')).click();
            });

            element(by.id('confirmation-modal')).element(by.id('btn-accept')).click();
            browser.sleep(500);

            expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();
            //check if toaster is displayed
            //TODO: it would be nice, if we have tests for toaster content (title and message)
            var toaster = element(by.css('#toast-container'));
            expect(toaster.isDisplayed()).toBeTruthy();
            expect(toaster.isElementPresent(by.className('toast-error'))).toBeTruthy();
            expect(element.all(by.repeater('category in ctrl.categories')).count()).toBe(3);

        });
    });

    describe('creating a new category', function () {

        it('adds a new category', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element(by.className('btn-add')).click();
            var modal = element(by.className('modal-content'));
            modal.element(by.model('category.name')).sendKeys('hobby');
            modal.element(by.id('btn-accept')).click();

            expect(browser.isElementPresent(modal)).toBeFalsy();

            var toaster = element(by.id('toast-container'));
            expect(toaster.isDisplayed()).toBeTruthy();
            expect(toaster.isElementPresent(by.className('toast-success'))).toBeTruthy();

            var categories = element.all(by.repeater('category in ctrl.categories'));
            expect(categories.count()).toBe(4);
            categories.map(function (categoryElement) {
                return categoryElement.getText();
            }).then(function (categoriesNames) {
                expect(categoriesNames).toContain('hobby');
            });
        });

        it('does not add a category when operation is not been confirmed', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element(by.className('btn-add')).click();
            var modal = element(by.className('modal-content'));
            modal.element(by.model('category.name')).sendKeys('fruits');
            modal.element(by.id('btn-decline')).click();

            expect(browser.isElementPresent(modal)).toBeFalsy();
            expect(element.all(by.repeater('category in ctrl.categories')).count()).toBe(3);
        });

        it('shows error message when api returns an exception', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element(by.className('btn-add')).click();
            var modal = element(by.className('modal-content'));
            modal.element(by.model('category.name')).sendKeys('category with error');
            modal.element(by.id('btn-accept')).click();

            expect(browser.isElementPresent(modal)).toBeFalsy();

            var toaster = element(by.id('toast-container'));
            expect(toaster.isDisplayed()).toBeTruthy();
            expect(toaster.isElementPresent(by.className('toast-error'))).toBeTruthy();

            expect(element.all(by.repeater('category in ctrl.categories')).count()).toBe(3);
        });
    });
});
