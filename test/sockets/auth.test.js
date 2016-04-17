'use strict';

require('dotenv').config();
var should = require('should');
var token = require('../../helpers/token');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);

describe('Auth Sockets', function () {
    var auth = require('../../sockets/auth');

    var server;

    before(function () {
        var io = require('../../server.js').io;
    });

    describe('JWT tokens', function () {

        it('should respond with seen if the user sends a token', function (done) {
            var client = sockets(socketsUrl);
            client.emit('jwt', {
                jwt: token.makeJWT(token.makeID(), 'guest', '/')
            });
            client.on('jwt', function(data){
                should.exist(data.seen);
                should.not.exist(data.token);
                done();
            });
        });

        it("should respond with a token if the user doesn't send one", function (done) {
            var client = sockets(socketsUrl);
            client.emit('jwt');
            client.on('jwt', function(data){
                should.exist(data.token);
                should.not.exist(data.seen);
                done();
            });
        });

    });

});
