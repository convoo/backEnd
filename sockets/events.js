/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- EVENTS
'use strict';

module.exports = function (io, r) {

    var sockets = require('./controllers.js')(r);

    //-- AUTH CONNECT & DISCONNECT     
    io.on('connection', function (socket, msg) {


        socket.on('jwt', function (msg) {
            sockets.jwt(socket, io, msg);
        });
        
        socket.on('twitterRequestToken', function (msg) {
            sockets.twitterRequestToken(socket, io, msg);
        });

        socket.on('disconnect', function () {
            sockets.disconnect(socket, r);
        });

        socket.on('latency', function (startTime, callBack) {
            callBack(startTime);
        });

        socket.on('editProfile', function (msg) {
            sockets.editProfile(socket, msg);
        });
        
        socket.on('getProfile', function (msg) {
            sockets.getProfile(socket, io, msg);
            console.log(socket.id);
        });
        
        socket.on('addRoom', function (msg) {  
            sockets.addRoom(msg);
        });
        
        
        
        

// TODO: Make this changefeed work 
        socket.on('onlineUsers', function (callBack) {
            sockets.onlineUsers(socket,io, r);
        });
    });
    //-- LOG OUT
};