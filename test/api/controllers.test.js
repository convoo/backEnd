'use strict';

var request = require('supertest');

describe('Main API', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close();
        done();
    });

    describe('#index', function () {

        it('should return a welcome message', function (done) {
            request(server)
                .get('/')
                .expect(200, {
                    message: "Welcome to Convoo's API"
                },done)
        });

    });

});
