'use strict';

require('dotenv').config();
var should = require('should');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
var options = {
    reconnect: true
};

describe('Main Sockets', function () {

    it('should be able to connect', function (done) {
        var client = sockets.connect(socketsUrl, options);
            client.on('connect', function(){
                done();
            });
    });


    describe('Hello', function () {

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
