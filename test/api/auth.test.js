'use strict';

var should = require('should');
var request = require('supertest');

describe('Authentication API', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close(done);
    });

    describe('#token', function () {

        it('should return a token', function (done) {
            request(server)
                .get('/auth/token')
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res.body.jwt);
                    done();
                });
        });

    });

    describe('#twitter', function () {

        it('should return a requestToken, requestTokenSecret and redirectUrl to twitter.com', function (done) {
            request(server)
                .get('/auth/twitter')
                .end(function(err, res) {
                    should.not.exist(err);
                    res.body.should.have.property('requestToken').which.is.a.String();
                    res.body.should.have.property('requestTokenSecret').which.is.a.String();
                    res.body.should.have.property('redirectUrl').which.is.a.String();
                    done();
                });
        });
    });

});
