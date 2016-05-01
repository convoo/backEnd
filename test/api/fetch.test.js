'use strict';

var request = require('supertest');
var should = require('should');

describe('Fetch API', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close(done);
    });

    describe('URL', function () {

        it('should return an object with data in it including a title', function (done) {
            request(server)
                .get('/fetch?url=https%3A%2F%2Fwww.google.com%2F')
                .expect(function(res){
                    should.exist(res.body);
                    should.exist(res.body.title);
                })
                .end(done);
        });

    });

});
