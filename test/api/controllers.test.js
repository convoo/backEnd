'use strict';

var request = require('supertest');
var server = require('../../server.js').server;

describe('Main API', function () {

    after(function (done) {
        server.close();
        done();
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
