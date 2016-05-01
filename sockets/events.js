/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- EVENTS
'use strict';


module.exports = function (io) {

    //-- AUTH CONNECT & DISCONNECT
    io.on('connect', function (socket, msg) {

        socket.lastAcivity = new Array(Date.now().toString());

        var sockets = require('./controllers');

        socket.emit('hello', {message: "Hello from Convoo!"})

        socket.on('jwt', function (msg) {
            rateLimit(socket);
            sockets.auth.jwt(socket, io, msg);
        });

        socket.on('twitterRequestToken', function (msg) {
            rateLimit(socket);
            sockets.auth.twitterRequestToken(socket, io, msg);
        });

        socket.on('disconnect', function () {
            sockets.auth.disconnect(socket);
        });

        socket.on('latency', function (startTime, callBack) {
            rateLimit(socket);
            callBack(startTime);
        });

        socket.on('editProfile', function (msg) {
            rateLimit(socket);
            sockets.user.editProfile(socket, msg);
        });

        socket.on('getProfile', function (msg) {
            rateLimit(socket);
            sockets.user.getProfile(socket, io, msg);
        });

        socket.on('addRoom', function (msg) {
            rateLimit(socket);
            sockets.room.add(msg);
        });

        socket.on('fetchUrl', function (msg) {
            sockets.fetch.url(socket, io, msg);
        });


// TODO: Make this changefeed work
        socket.on('onlineUsers', function (callBack) {
            sockets.onlineUsers(socket,io, r);
        });
    });



    //-- LOG OUT
};

        function rateTracker(socket){
            if (socket.lastActivity == undefined) {
                socket.lastActivity = [];
            }

            if (socket.lastActivity.length > 5) {
                socket.lastActivity.shift();
            }
            socket.lastActivity.push(Date.now().toString());
        }

        function rateLimit(socket){

            rateTracker(socket);
            if (socket.lastActivity.length < 5){
               return;
            }

            if(parseInt(Date.now()) -parseInt(socket.lastAcivity[0]) < 200){
               socket.disconnect();
               console.log('Slow down: ');
               return;
            }
        }
