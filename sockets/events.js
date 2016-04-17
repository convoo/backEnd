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
            console.log(sockets);
            sockets.auth.jwt(socket, io, msg);
        });

        socket.on('twitterRequestToken', function (msg) {
            sockets.auth.twitterRequestToken(socket, io, msg);
        });

        socket.on('disconnect', function () {
            sockets.auth.disconnect(socket);
        });

        socket.on('latency', function (startTime, callBack) {
            callBack(startTime);
        });

        socket.on('editProfile', function (msg) {
            sockets.user.editProfile(socket, msg);
        });

        socket.on('getProfile', function (msg) {
            sockets.user.getProfile(socket, io, msg);
            console.log(socket.id);
        });

        socket.on('addRoom', function (msg) {
            sockets.room.add(msg);
        });





// TODO: Make this changefeed work
        socket.on('onlineUsers', function (callBack) {
            sockets.onlineUsers(socket,io, r);
        });
    });
    //-- LOG OUT
};
