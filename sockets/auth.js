'use strict';

var token = require('../helpers/token.js');
var user = require('../models/user.js');

  //----------------------------- ON CONNECTOIN
exports.jwt = function (socket, io, msg) {


            if(msg.jwt){
            console.log('You sent me a token');
            var userID = token.readJWT(msg.jwt).user_id;
            user.seen(userID, socket.id, '/');

            } else {

            console.log('You did not sent me a token');
            var newUserID = token.makeID();
            console.log(newUserID);
            var token = token.makeJWT(newUserID, "visitor", process.env.WEB_SITE);
            user.add('visitor', newUserID, socket.id, '/');
            io.to(socket.id).emit('jwt', {token:token});

            }
    };

//----------------------------- TWITTER REQUEST TOKEN

exports.twitterRequestToken = function (socket, io, msg) {
        console.log('Making Twittr Request Token');
        token.makeTwitterRequest(function (redirectUrl, requestToken, requestTokenSecret) {
          console.log('Sending Twittr Request Token');
          io.to(socket.id).emit('twitterRequestToken', {redirectUrl:redirectUrl, requestToken: requestToken, requestTokenSecret: requestTokenSecret});
        })
    };

//----------------------------- ON DISCONECTED
exports.disconnect = function (socket) {
            user.disconnect(socket.id);
    };

//----------------------------- ON LOGOUT
exports.logout = function (socket) {

    };

