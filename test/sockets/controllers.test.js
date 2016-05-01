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
             client.disconnect();
             done();
        });
    });

    describe('Hello', function () {
        it('should send a message on connection', function (done) {
            var client = sockets.connect(socketsUrl, options);
            client.on('hello', function(data){
                should.exist(data.message);
                console.log(data.message);
                client.disconnect();
                data.message.should.equal("Hello from Convoo!");
                done();
            });
        });

    });

    describe('Rate limiting', function () {
        it('should disconnect after emiting 6 events in under 200ms', function (done) {
            var client = sockets.connect(socketsUrl, options);
            client.emit("latency", {startTime: Date.now() }, function(data){});
            client.emit("latency", {startTime: Date.now() }, function(data){});
            client.emit("latency", {startTime: Date.now() }, function(data){});
            client.emit("latency", {startTime: Date.now() }, function(data){
                should.exist(data);
            });
            setTimeout(function(){
                client.connected.should.be.false();
                done();
             }, 3);
        });
    });
});
