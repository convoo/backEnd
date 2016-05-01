'use strict';

require('dotenv').config();
var should = require('should');
var token = require('../../helpers/token');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
var options = {
    transports: ['websocket'],
    'force new connection': true,
    reconnect: true
};

describe('Authentication Sockets', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close();
          done();
    });

    describe('JWT tokens', function () {


        it('should respond with seen if the user sends a token', function (done) {
            var client1 = sockets.connect(socketsUrl, options);
            client1.emit('jwt', {
                jwt: token.makeJWT(token.makeID(), 'guest', '/')
            });
            client1.on('jwt', function(data){
                should.exist(data.seen);
                should.not.exist(data.token);
                client1.disconnect();
                done();
            });
        });

        it("should respond with a token if the user doesn't send one", function (done) {
            var client2 = sockets.connect(socketsUrl, options);
            client2.emit('jwt');
            client2.on('jwt', function(data){
                should.exist(data.token);
                should.not.exist(data.seen);
                client2.disconnect();
                done();
            });
        });

    });



});
