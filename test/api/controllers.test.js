'use strict';

var request = require('supertest');

describe('1 - Main', function () {
    var server;

    before(function () {
        server = require('../../server.js').server;
    })
    after(function () {
        server.close();
    })

    describe('Index', function () {

        it('should return a welcome message', function (done) {
            request(server)
                .get('/')
                .expect(200, {
                    message: "Welcome to Convoo's API"
                },done)
        });

    });

});
