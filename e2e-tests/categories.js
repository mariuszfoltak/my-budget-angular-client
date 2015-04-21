'use strict';

function getText(item) {
    return item.getText();
}

describe('Categories module', function () {
    var mocks = require('./mocks');
    var toaster = element(by.id('toast-container'));
    var categories = element.all(by.repeater('category in ctrl.categories'));
    var modal = element(by.className('modal-content'));

    beforeEach(function () {
        browser.addMockModule(mocks.auth.name, mocks.auth.module, {username: 'mariusz', password: 'abc123'});
        browser.addMockModule(mocks.accounts.name, mocks.accounts.module);
        browser.addMockModule(mocks.categories.name, mocks.categories.module);
    });

    describe('showing a categories list', function () {

        it('shows a categories list', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            expect(categories.count()).toBe(3);

            //check if categories list has expected elements
            categories.map(getText).then(function (categories) {
                expect(categories).toContain('food');
                expect(categories).toContain('house');
                expect(categories).toContain('car');
            });
        });

        it('shows a sub categories list', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            categories.then(function (categoryElems) {
                var mainCategoryElem = categoryElems[0];
                mainCategoryElem.all(by.className('list-group-item')).get(0).click();
                var subCategories = mainCategoryElem.all(by.repeater('subItem in ctrl.getSubItems(category)'));
                expect(subCategories.count()).toBe(2);

                //check if subCategories list has expected elements
                subCategories.map(getText).then(function (subCategories) {
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

            //FIXME: get element by name, not index
            categories.then(function (categories) {
                categories[1].element(by.className('removeButton')).click();
            });

            element(by.id('confirmation-modal')).element(by.id('btn-accept')).click();

            expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();

            //check if toaster is displayed
            //TODO: it would be nice, if we have tests for toaster content (type, title and message)
            expect(toaster.isDisplayed()).toBeTruthy();

            expect(categories.count()).toBe(2);
            expect(categories.map(getText)).not.toContain('house');
        });

        it('does not remove a category when operation is not been confirmed', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            //FIXME: get element by name, not index
            categories.then(function (categories) {
                categories[1].element(by.className('removeButton')).click();
            });

            element(by.id('confirmation-modal')).element(by.id('btn-decline')).click();
            browser.sleep(500);

            expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();
            expect(categories.count()).toBe(3);
        });

        it('shows error message when api returns an exception', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            //FIXME: get element by name, not index
            categories.then(function (categories) {
                categories[2].element(by.className('removeButton')).click();
            });

            element(by.id('confirmation-modal')).element(by.id('btn-accept')).click();
            browser.sleep(500);

            expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();
            //check if toaster is displayed
            //TODO: it would be nice, if we have tests for toaster content (title and message)
            expect(toaster.isDisplayed()).toBeTruthy();
            expect(toaster.isElementPresent(by.className('toast-error'))).toBeTruthy();
            expect(categories.count()).toBe(3);

        });
    });

    describe('creating a new category', function () {

        it('adds a new category', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element.all(by.className('btn-add')).get(0).click();
            var modal = element(by.className('modal-content'));
            modal.element(by.model('category.name')).sendKeys('hobby');
            modal.element(by.id('btn-accept')).click();

            expect(browser.isElementPresent(modal)).toBeFalsy();

            expect(toaster.isDisplayed()).toBeTruthy();
            expect(toaster.isElementPresent(by.className('toast-success'))).toBeTruthy();

            expect(categories.count()).toBe(4);
            categories.map(getText).then(function (categoriesNames) {
                expect(categoriesNames).toContain('hobby');
            });
        });

        it('does not add a category when operation is not been confirmed', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element.all(by.className('btn-add')).get(0).click();
            var modal = element(by.className('modal-content'));
            modal.element(by.model('category.name')).sendKeys('fruits');
            modal.element(by.id('btn-decline')).click();

            expect(browser.isElementPresent(modal)).toBeFalsy();
            expect(categories.count()).toBe(3);
        });

        it('shows error message when api returns an exception', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            element.all(by.className('btn-add')).get(0).click();
            var modal = element(by.className('modal-content'));
            modal.element(by.model('category.name')).sendKeys('category with error');
            modal.element(by.id('btn-accept')).click();

            expect(browser.isElementPresent(modal)).toBeFalsy();

            expect(toaster.isDisplayed()).toBeTruthy();
            expect(toaster.isElementPresent(by.className('toast-error'))).toBeTruthy();

            expect(categories.count()).toBe(3);
        });
    });

    describe('removing a sub category from list', function () {

        it('does not remove a category when operation is not been confirmed', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            //FIXME: get element by name, not index
            categories.then(function (categories) {

                var mainCategory = categories[0];
                mainCategory.all(by.className('list-group-item')).get(0).click();

                var subCategories = mainCategory.all(by.repeater('subItem in ctrl.getSubItems(category)'));

                subCategories.then(function (subCategories) {
                    subCategories[1].element(by.className('remove-button')).click();
                });

                element(by.id('confirmation-modal')).element(by.id('btn-decline')).click();
                browser.sleep(500);

                expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();
                expect(subCategories.count()).toBe(2);
            });

        });

        it('shows error message when api returns an exception', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            //FIXME: get element by name, not index
            categories.then(function (categories) {

                var mainCategory = categories[0];
                mainCategory.all(by.className('list-group-item')).get(0).click();

                var subCategories = mainCategory.all(by.repeater('subItem in ctrl.getSubItems(category)'));

                subCategories.then(function (subCategories) {
                    subCategories[0].element(by.className('remove-button')).click();
                });

                element(by.id('confirmation-modal')).element(by.id('btn-accept')).click();
                browser.sleep(500);

                expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();

                // check if toaster is displayed
                // TODO: it would be nice, if we have tests for toaster content (title and message)
                expect(toaster.isDisplayed()).toBeTruthy();
                expect(toaster.isElementPresent(by.className('toast-error'))).toBeTruthy();

                expect(subCategories.count()).toBe(2);
            });
        });

        it('removes a category from list', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            //FIXME: get element by name, not index
            categories.then(function (categories) {

                var mainCategory = categories[0];
                mainCategory.all(by.className('list-group-item')).get(0).click();

                var subCategories = mainCategory.all(by.repeater('subItem in ctrl.getSubItems(category)'));

                subCategories.then(function (subCategories) {
                    subCategories[1].element(by.className('remove-button')).click();
                });

                element(by.id('confirmation-modal')).element(by.id('btn-accept')).click();
                browser.sleep(500);

                expect(browser.isElementPresent(by.id('confirmation-modal'))).toBeFalsy();

                // check if toaster is displayed
                // TODO: it would be nice, if we have tests for toaster content (title and message)
                expect(toaster.isDisplayed()).toBeTruthy();
                expect(toaster.isElementPresent(by.className('toast-success'))).toBeTruthy();

                expect(subCategories.count()).toBe(1);
                expect(categories.map(getText)).not.toContain('vegetables');
            });
        });
    });

    describe('creating a new sub category', function () {

        it('does not add a category when operation is not been confirmed', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            categories.then(function (categories) {
                var mainCategory = categories[0];
                var subCategories = mainCategory.all(by.repeater('subItem in ctrl.getSubItems(category)'));

                mainCategory.element(by.className('btn-add')).click();

                modal.element(by.model('category.name')).sendKeys('fruits');
                modal.element(by.id('btn-decline')).click();

                expect(browser.isElementPresent(modal)).toBeFalsy();
                expect(subCategories.count()).toBe(2);
            });
        });

        it('shows error message when api returns an exception', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            categories.then(function (categories) {
                var mainCategory = categories[0];
                var subCategories = mainCategory.all(by.repeater('subItem in ctrl.getSubItems(category)'));

                mainCategory.element(by.className('btn-add')).click();

                modal.element(by.model('category.name')).sendKeys('error category');
                modal.element(by.id('btn-accept')).click();

                expect(browser.isElementPresent(modal)).toBeFalsy();

                expect(toaster.isDisplayed()).toBeTruthy();
                expect(toaster.isElementPresent(by.className('toast-error'))).toBeTruthy();

                expect(subCategories.count()).toBe(2);
            });
        });

        it('adds a new sub category', function () {
            browser.get('#/app/ui/transactions');
            browser.sleep(500);

            categories.then(function (categories) {
                var mainCategory = categories[1];
                var subCategories = mainCategory.all(by.repeater('subItem in ctrl.getSubItems(category)'));

                mainCategory.element(by.className('btn-add')).click();

                modal.element(by.model('category.name')).sendKeys('fruits');
                modal.element(by.id('btn-accept')).click();

                expect(browser.isElementPresent(modal)).toBeFalsy();

                expect(toaster.isDisplayed()).toBeTruthy();
                expect(toaster.isElementPresent(by.className('toast-success'))).toBeTruthy();

                expect(subCategories.count()).toBe(1);
                subCategories.map(getText).then(function (categoriesNames) {
                    expect(categoriesNames).toContain('fruits');
                });
            });
        });
    });
});
