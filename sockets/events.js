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

        // Index
        socket.emit('hello', {message: "Hello from Convoo!"})

        // Authentication & Connection
        socket.on('jwt', function (msg) {
            sockets.auth.jwt(socket, io, msg);
        });

        socket.on('twitterRequestToken', function () {
            sockets.auth.twitterRequestToken(socket, io);
        });

        socket.on('twitterCallback', function(msg) {
            sockets.auth.twitterCallback(socket, io, msg);
        })

        socket.on('disconnect', function () {
            sockets.auth.disconnect(socket);
        });

        socket.on('latency', function (startTime, callBack) {
            callBack(startTime);
        });

        // Users
        socket.on('editProfile', function (msg) {
            sockets.user.editProfile(socket, msg);
        });

        socket.on('getProfile', function (msg) {
            sockets.user.getProfile(socket, io, msg);
            console.log(socket.id);
        });

        // Rooms
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
