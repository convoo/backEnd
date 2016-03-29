/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- CONTROLLERS 
'use strict';

var uuid = require('uuid-js'),
    jwt = require('jsonwebtoken'),
    twitterAPI = require('node-twitter-api'),
    aws = require('aws-sdk');
    
var twitter = new twitterAPI({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callback: process.env.TWITTER_CALLBACK
});

module.exports = function(r){
    var m = {};
    var f = require('../functions/f.js')(r, uuid, twitter, jwt, aws);
 
//----------------------------- ON CONNECTOIN   
    m.jwt = function (socket, io, msg) {
            
      
            if(msg.jwt){                   
            console.log('You sent me a token');
            var userID = f.tokens.readToken(msg.jwt).user_id;
            f.users.seenUser(userID, socket.id, '/');
          
            } else {
            
            console.log('You did not sent me a token');
            var newUserID = f.tokens.makeID();
            console.log(newUserID);
            var token = f.tokens.makeToken(newUserID, "visitor", process.env.WEB_SITE);
            f.users.addUser('visitor', newUserID, socket.id, '/');
            io.to(socket.id).emit('jwt', {token:token});
            
            }
    };

//----------------------------- TWITTER REQUEST TOKEN  
    
    m.twitterRequestToken = function (req, res) {
        console.log('Making Twittr Request Token');    
        f.tokens.makeTwitterRequestToken(function (redirectUrl, requestToken, requestTokenSecret) {
          console.log('Sending Twittr Request Token');    
          io.to(socket.id).emit('twitterRequestToken', {requestToken: requestToken, requestTokenSecret: requestTokenSecret});
        })
    };
    
//----------------------------- ON DISCONECTED
    m.disconnect = function (socket) {
            f.users.disconnect(socket.id);
    };
    
 //----------------------------- ON EDIT PROFILE
    m.editProfile = function (socket, msg) {

        var imageSent;
        if(msg.image60){
             imageSent = true;
        } else {
            imageSent = false;
        }
         
            var userID = f.tokens.readToken(msg.jwt).user_id;
            f.aws.s3PutBase64(msg.image60, 'images/users/'+userID, '60');   
            f.aws.s3PutBase64(msg.image300, 'images/users/'+userID, '300');      
            f.users.editProfile(userID, msg.fullName, msg.email, msg.bio, msg.emailMe, msg.notifyMe, imageSent);
    };
    

  //----------------------------- ON GET PROFILE
    m.getProfile = function (socket, io, msg) {
            var userID = f.tokens.readToken(msg).user_id;
            f.users.getProfile(userID).then(function (profile) {
                console.log(profile);
                 console.log(socket.id);
            io.to(socket.id).emit('resGetProfile', {profile: profile});
        });
           
    };
    
//----------------------------- ADD ROOM
    m.addRoom = function (msg) {        
           var userID = f.tokens.readToken(msg.jwt).user_id;
           var roomName = msg.roomName;
           console.log(userID);
           console.log(roomName);
           f.rooms.addRoom(userID, roomName);
    };    
    
//----------------------------- ONLINE USERS STREAM
    m.onlineUsers = function (socket, io) {
        socket.on('onlineUsers', function (msg) {
           f.users.onlineUsers();
        });
    };


//----------------------------- ON LOGOUT
    m.logout = function (socket) {

    };
        
 //----------------------------- END  
    return m; 
};