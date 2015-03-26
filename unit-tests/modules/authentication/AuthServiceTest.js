'use strict';

describe('Authorization Service', function () {

    beforeEach(module('ui.router'));
    beforeEach(module('app.authentication'));

    describe('getSession() method', function() {
       it('should return Session object', inject(function(AuthService, Session){
          expect(AuthService.getSession()).toBe(Session);
       }));
    });

    describe('isAuthenticated() method', function () {
        it('should return false when user is not logged', inject(function (AuthService, Session) {
            Session.destroy();
            expect(AuthService.isAuthenticated()).toBeFalsy();
        }));
        it('should return true when user is logged', inject(function (AuthService, Session) {
            Session.create('mariusz', 'abc123');
            expect(AuthService.isAuthenticated()).toBeTruthy();
        }));
    });

    describe('destroy() method', function () {
        it('should logout user', inject(function (AuthService, Session) {
            Session.create('mariusz', 'abc123');
            AuthService.logout();
            expect(AuthService.isAuthenticated()).toBeFalsy();
        }));
    });


    describe('login() method', function() {
        it('should create session with user credentials', inject(function(AuthService, Session){
            AuthService.login({username: 'mariusz', password: 'abc123'});
            expect(Session.getUsername()).toBe('mariusz');
            expect(Session.getPassword()).toBe('abc123');
        }));
        it('should set http headers', inject(function(AuthService, $http){
            AuthService.login({username: 'mariusz', password: 'abc123'});
            expect($http.defaults.headers.common["Authorization-User"]).toBe('mariusz');
            expect($http.defaults.headers.common["Authorization-Password"]).toBe('abc123');
        }));
    });
});
