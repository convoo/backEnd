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
            sockets.user.editProfile(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('editProfile', {error: "An error occurred"});
                    } else {
                        socket.emit('editProfile', {result: result});
                    }
                });
        });

        socket.on('getProfile', function (msg) {
            sockets.user.getProfile(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('getProfile', {error: "An error occurred"});
                    } else {
                        socket.emit('getProfile', {result: result});
                    }
                });
        });

        socket.on('forceDeleteUser', function (msg) {
            sockets.user.forceDelete(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('forceDeleteUser', {error: "An error occurred"});
                    } else {
                        socket.emit('forceDeleteUser', {result: result});
                    }
                });
        });

        // Rooms
        socket.on('addRoom', function (msg) {
            sockets.room.add(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('addRoom', {error: "An error occurred"});
                    } else {
                        socket.emit('addRoom', {result: result});
                    }
                });
        });
        socket.on('getRoom', function (msg) {
            sockets.room.get(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('getRoom', {error: "An error occurred"});
                    } else {
                        socket.emit('getRoom', {result: result});
                    }
                });
        });
        socket.on('getRoomBySlug', function (msg) {
            sockets.room.getBySlug(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('getRoomBySlug', {error: "An error occurred"});
                    } else {
                        socket.emit('getRoomBySlug', {result: result});
                    }
                });
        });
        socket.on('forceDeleteRoom', function (msg) {
            sockets.room.forceDelete(msg)
                .then(function(result){
                    if (result == null) {
                        socket.emit('forceDeleteRoom', {error: "An error occurred"});
                    } else {
                        socket.emit('forceDeleteRoom', {result: result});
                    }
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
