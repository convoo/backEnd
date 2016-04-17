'use strict';

require('dotenv').config();
var should = require('should');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
var options = {
    transports: ['websocket'],
    'force new connection': true,
    reconnect: true
};

describe('Main Sockets', function () {
    var server;

    before(function () {
        var io = require('../../server.js').io;
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
