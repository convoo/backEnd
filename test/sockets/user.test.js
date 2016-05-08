'use strict';

require('dotenv').config();
var should = require('should');
var Token = require('../../helpers/token');
var sockets = require('socket.io-client');
var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
var options = {
    transports: ['websocket'],
    'force new connection': true,
    reconnect: true
};

describe('User Sockets', function () {
    var server;

    beforeEach(function(){
         delete require.cache[require.resolve('../../server.js')];
         server = require('../../server.js').server;
    });

    afterEach(function(done){
        server.close();
          done();
    });



    it("should get an error when getting a user who doesn't exist", function (done) {
        var client = sockets.connect(socketsUrl, options);
        client.emit('getProfile', {userID: "123asfoi212312"});
        client.on('getProfile', function(data){
            should.exist(data);
            data.should.have.property('error').which.is.a.String();
            done();
        });
    });

    // it('should get and delete a user', function (done) {
    //     var client = sockets.connect(socketsUrl, options);
    //     client.emit('getProfile', {userID: userID});
    //     client.on('getProfile', function(data){
    //         data.result.should.have.property('').which.is.a.String();
    //         client.emit('forceDelete', {userID: userID});
    //         client.on('forceDelete', function(data){
    //             data.should.not.have.property('error');
    //             data.should.have.property('result');
    //             done();
    //         })
    //     });
    // });

});
