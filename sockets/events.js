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
            sockets.user.editProfile(msg);
        });

        socket.on('getProfile', function (msg) {
            sockets.user.getProfile(msg);
        });

        // Rooms
        socket.on('addRoom', function (msg) {
            sockets.room.add(msg)
                .then(function(result){
                    socket.emit('roomAdded',{result: result});
                });
        });





// TODO: Make this changefeed work
        socket.on('onlineUsers', function () {
            sockets.user.onlineUsers()
                .then(function(result){
                     socket.emit("returnOnlineUsers", {result: result});
                });
        });
    });
    //-- LOG OUT
};
