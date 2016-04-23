'use strict';

var token = require('../helpers/token.js');
var user = require('../models/user.js');

  //----------------------------- ON CONNECTOIN
exports.jwt = function (socket, io, msg) {
    if(msg != undefined && msg.jwt != undefined){
        var userID = token.readJWT(msg.jwt).user_id;
        user.seen(userID, socket.id, '/');
        io.to(socket.id).emit('jwt', {seen: "Seen!", token: msg.jwt});
    } else {
        var newUserID = token.makeID();
        var t = token.makeJWT(newUserID, "visitor", process.env.WEB_SITE);
        user.add('visitor', newUserID, socket.id);
        //TO DO: add log
        io.to(socket.id).emit('jwt', {token:t});
    }
};

//----------------------------- TWITTER REQUEST TOKEN

exports.twitterRequestToken = function (socket, io) {
        token.makeTwitterRequest(function (redirectUrl, requestToken, requestTokenSecret, err) {
            if (!err) {
                io.to(socket.id).emit('twitterRequestToken', {
                    redirectUrl:redirectUrl,
                    requestToken: requestToken,
                    requestTokenSecret: requestTokenSecret
                });
            }
        })
    };

//----------------------------- TWITTER REQUEST TOKEN
exports.twitterCallback = function (socket, io, msg) {
    var t = msg.twitterToken;
    var userID = token.readJWT(msg.jwt).user_id;
    token.makeTwitterAccess(t.requestTokenSecret, t.requestToken, t.oauthVerifier, function (accessToken, accessTokenSecret) {
        token.verifyTwitterAccess(accessToken, accessTokenSecret, function (twitterDetails) {
            // TODO:  possibly change the users JWT cookie
            user.twitterDetails(userID, accessToken, accessTokenSecret, twitterDetails)
                .catch(function(err){
                    console.log(err);
                    io.to(socket.id).emit('twitterCallback', {status: "Error", message: err});
                })
                .then(function(){
                    io.to(socket.id).emit('twitterCallback', {status: "Success", message: "User logged in"});
                });
        });
    });
}

//----------------------------- ON DISCONECTED
exports.disconnect = function (socket) {
            user.disconnect(socket.id);
    };

//----------------------------- ON LOGOUT
exports.logout = function (socket) {

    };

