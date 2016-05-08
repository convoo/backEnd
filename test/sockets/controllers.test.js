'use strict';

require('dotenv').config();
var should = require('should');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
var options = {
    reconnect: true
};

describe('Main Sockets', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close();
        done();
    });

    it('should be able to connect', function (done) {
        var client = sockets.connect(socketsUrl, options);
        client.on('connect', function(){
            done();
        });
    });


    describe('#hello', function () {

        it('should send a message on connection', function (done) {
            var client = sockets.connect(socketsUrl, options);
            client.on('hello', function(data){
                should.exist(data.message);
                data.message.should.equal("Hello from Convoo!");
                done();
            });
        });

    });
});
