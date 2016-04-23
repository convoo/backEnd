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

    describe('#jwt', function () {


        it('should respond with seen if the user sends a token', function (done) {
            var client = sockets.connect(socketsUrl, options);
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
            var client = sockets.connect(socketsUrl, options);
            client.emit('jwt');
            client.on('jwt', function(data){
                should.exist(data.token);
                should.not.exist(data.seen);
                done();
            });
        });
    });

    describe('#twitterRequestToken', function () {

        it('should send a twitter requestToken, requestTokenSecret and redirect url to twitter.com', function (done) {
            var client = sockets.connect(socketsUrl, options);
            client.emit('twitterRequestToken');
            client.on('twitterRequestToken', function(data){
                data.should.have.property('requestToken').which.is.a.String();
                data.should.have.property('requestTokenSecret').which.is.a.String();
                data.should.have.property('redirectUrl').which.is.a.String();
                done();
            });
        });
    });

});
