'use strict';

describe('Session object', function () {

    var Session,
        login = "shrek",
        password = "fiona";

    beforeEach(module('ui.router'));
    beforeEach(module('app.authentication'));

    beforeEach(inject(function (_Session_) {
        Session = _Session_;
    }));

    describe('after create session', function () {

        beforeEach(function () {
            Session.create(login, password);
        });

        it('should return "' + login + '" as username', function () {
            expect(Session.getUsername()).toBe(login);
        });
        it('should return "' + password + '" as password', function () {
            expect(Session.getPassword()).toBe(password);
        });
    });

    describe('after destroy session', function () {

        beforeEach(function () {
            Session.destroy();
        });

        it('should return null username', function () {
            expect(Session.getUsername()).toBeNull();
        });
        it('should return null password', function () {
            expect(Session.getPassword()).toBeNull();
        });
    });
});
