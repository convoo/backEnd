'use strict';

require('dotenv').config();
var should = require('should');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
var options = {
    reconnect: true
};

describe('Fetch Sockets', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close();
        done();
    });

    describe('URL', function () {

        it('should get an object with data in it including a title', function (done) {
            var client = sockets.connect(socketsUrl, options);
            client.emit("fetchUrl", {
                url: "https://google.com"
            });

            client.on('resFetchUrl', function(data){
                should.exist(data);
                should.exist(data.title);
                done();
            });
        });

    });
});
