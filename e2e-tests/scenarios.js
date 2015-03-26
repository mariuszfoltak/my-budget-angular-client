'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function () {

    browser.get('index.html');
    browser.executeScript('window.localStorage.username = "mariusz"');


    it('should automatically redirect to /app/ui/transactions when location hash/fragment is empty', function () {
        browser.get('index.html');
        browser.sleep(500);
        expect(browser.getLocationAbsUrl()).toMatch("/app/ui/transactions");
    });


    //describe('view1', function() {
    //
    //  beforeEach(function() {
    //    browser.get('index.html#/view1');
    //  });
    //
    //
    //  it('should render view1 when user navigates to /view1', function() {
    //    expect(element.all(by.css('[ng-view] p')).first().getText()).
    //      toMatch(/partial for view 1/);
    //  });
    //
    //});


    //describe('view2', function() {
    //
    //  beforeEach(function() {
    //    browser.get('index.html#/view2');
    //  });
    //
    //
    //  it('should render view2 when user navigates to /view2', function() {
    //    expect(element.all(by.css('[ng-view] p')).first().getText()).
    //      toMatch(/partial for view 2/);
    //  });
    //
    //});
});
