/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- EVENTS
'use strict';

module.exports = function (io) {

    //-- AUTH CONNECT & DISCONNECT
    io.on('connect', function (socket, msg) {


        var sockets = require('./controllers');

        socket.emit('hello', {message: "Hello from Convoo!"})

        socket.on('jwt', function (msg) {
            rateLimit(100);
            sockets.auth.jwt(socket, io, msg);
        });

        socket.on('twitterRequestToken', function (msg) {
            rateLimit(100);
            sockets.auth.twitterRequestToken(socket, io, msg);
        });

        socket.on('disconnect', function () {
            rateLimit(100);
            sockets.auth.disconnect(socket);
        });

        socket.on('latency', function (startTime, callBack) {
            rateLimit(100);
            callBack(startTime);
        });

        socket.on('editProfile', function (msg) {
            rateLimit(100);
            sockets.user.editProfile(socket, msg);
        });

        socket.on('getProfile', function (msg) {
            rateLimit(100);
            sockets.user.getProfile(socket, io, msg);
        });

        socket.on('addRoom', function (msg) {
            rateLimit(100);
            sockets.room.add(msg);
        });


        function rateLimit(max){
            if(Date.now() - socket.lastEventTimestamp < max){
               // socket.disconnect();
               // return;
               console.log('Slow down: ' + Date.now() - socket.lastEventTimestamp < max);
            }
        }
        socket.lastEventTimestamp = Date.now();









// TODO: Make this changefeed work
        socket.on('onlineUsers', function (callBack) {
            sockets.onlineUsers(socket,io, r);
        });
    });
    //-- LOG OUT
};
