'use strict';

var should = require('should');
var request = require('supertest');

describe('Authentication', function () {
    var server;

    before(function () {
        server = require('../../server.js');
    })
    after(function () {
        server.close();
    })

    describe('JWT Token', function () {

        it('should add a cookie', function (done) {
            var agent = request.agent(server);
            agent
                .get('/auth/token')
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res.headers['set-cookie']);
                    done();
                });
        });


        it('should redirect to /', function (done) {
            request(server)
                .get('/auth/token')
                .expect(302)
                .end(function(err, res){
                    should.not.exist(err);
                    res.header.location.should.equal('/');
                    done();
                })
        });

    });

});
