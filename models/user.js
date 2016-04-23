/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- USERS
            // TODO: If the user has a token but the user is not in the data abase, delete the local storage, then request another token
            // TODO: Who is online
            // TODO: Register User
            // TODO: Convert user image to smallr sizes and base64 to rethink
            // TODO: Edit User Profile inc image
            // TODO: Days on website
            // TODO: Following and followers
            // TODO: Count / Show all rooms created by user
            // TODO: Edit Notification and Email settings
            // TODO: Where is the user
            // TODO: Upgrade user from visitor to user by twitter
            // TODO: Upgrade user from user to admin only by admin
            // TODO: Discuss, user states:
                        // online = they are connected to a socked
                        // offline = they are not connected to a socked
                        // hidden = they are connected to a socked to but are not identifiable
                        // site blocked = they are banned from the site
                        // room blocked = they are connected to a socked to but cant be visable in a room
                        // user blocked= they are connected to a socked to but are blocked from communicating/@/follow with another user

'use strict';
var r = require("rethinkdb");
var log = require('./log.js');
var Token = require('../helpers/token');
var table = r.db(process.env.RETHINK_DB).table("users");

//----------------------------- ADD USER
exports.add = function (userType, userID, socketID) {

        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        return c.then(function(conn){
            // Insert user
            return table.insert({
                id: userID,
                user_type: userType,
                socket_id: socketID,
                created_at: r.now(),
                last_seen: r.now(),
                status:'online'
            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log("Error: ", err);
            })
            // Close the connection
            .then(function(result){
                conn.close();
                return result;
            });
        });
    };

 //----------------------------- SEEN USER

exports.seen = function (userID, socketID, url) {

        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // update socket id
            table.filter({id:userID}).update({
                socket_id: socketID,
                last_seen: r.now(),
                status:'online'

            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });

        // make log
        // log.add('Updated Socket ID!', userID, url);
 };

  //----------------------------- DISCONECTED USER

exports.disconnect = function (socketID) {

        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // update socket id
            table.filter({socket_id:socketID}).update({
                last_seen: r.now(),
                status:'offline'

            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });

 };

    //----------------------------- UPDATE USERS TWITTER DETAILS
    // TODO: Save twitter details to rethink!
    // Try to find a user with the same [access Token] if you find one, update the twitter details in rethnk, then re issue the jwt cookie
    // If you dont find one, find a user with the same [userID] and update the twitter details
    // Why? If a user deletes his jwt then registers again he will have lots of accounts! bad :(

    //r.db('website').table('users').filter({twitter:{access_token: accessToken}})
    //r.db('website').table('users').filter({id:userID})
    //r.db('website').table('users').filter({id:userID}).update({})
    //r.db('website').table('users').filter({id:userID}).update({
    //    user_type:"registered",
    //    last_seen: r.now(),
    //    twitter: {twitterDetails}
    //     })


exports.twitterDetails = function (userID, accessToken, accessTokenSecret, twitterDetails) {
    var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });
    return c.then(function (conn) {
        return table.filter({user_name: twitterDetails.screen_name})
            .run(conn)
            .then(function (result) {
                return result.toArray()
                    .then(function(userArray){
                        if (userArray.length < 1) {
                            var newUserID = userID;
                            var dateJoined = r.now();
                        } else {
                            var newUserID = userArray[0].id;
                            var dateJoined = userArray[0].joined_on;
                        }
                        return table.get(newUserID)
                            .update({
                                user_name: twitterDetails.screen_name,
                                name: twitterDetails.name,
                                bio: twitterDetails.description,
                                location: twitterDetails.location,
                                profile_image: twitterDetails.profile_image_url_https,
                                timezone: twitterDetails.time_zone,
                                user_type: "User",
                                joined_on: dateJoined
                            })
                            .run(conn)
                        // Catch any errors
                            .catch(function (err) {
                                console.log("Error",err);
                            })
                        // Close the connection
                            .then(function () {
                                conn.close();
                                return {
                                    jwt:Token.makeJWT(userID, 'User', '/'),
                                    username: twitterDetails.screen_name,
                                    photo: twitterDetails.profile_image_url_https,
                                    dateJoined: dateJoined
                                }
                            });
                    });
            });

    });
        // make log
//   log.add('Upgrade visitor to user ', userID, "/");

    };


//----------------------------- UPGRADE USER
exports.upgrade = function (userID, photoOriginal, twitterID, lastUpdated) {
       // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Insert user
            table.get(userID).update({
                photo: photoOriginal,
                twitter_id: twitterID,
                updated_at: lastUpdated
            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });

        // make log
        log.add('Upgrade visitor to user ', userID, "/");
    };




//----------------------------- DELETE USER
exports.del = function (userID) {
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Insert user
            table.get(userID).update({
                deleted_at: r.now()
            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });
    };

exports.forceDelete = function (userID) {
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        return c.then(function(conn){
            // Insert user
            return table.get(userID)
            .delete({
                durability: "hard",
                returnChanges: true
            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .then(function(result){
                conn.close();
                return result;
            });
        });
    };

//----------------------------- MAKE USER ADMIN
exports.makeAdmin = function(userID, byUserID){
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Update user_type to admin
            table.get(userID).update({
                user_type: "admin"
            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });

        // make log
        // TODO: Handle multiple users and other objects when making log
        log.add('Make Admin ' + userID, byUserID, "/");
    };



//-----------------------------  ONLINE USERS

exports.onlineAll = function(callback){
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Update user_type to admin
            table.filter({
                status: "online"
            })
            .changes().run(conn)
            // Catch any errors
            .catch(function(err, result){
                console.log(err);
                console.log(result);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });


    };

//-----------------------------  EDIT PROFILE

exports.edit = function(userID, fullName, email, bio, emailMe, notifyMe){
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Update user_type to admin
       table.filter({id:userID}).update({
                last_seen: r.now(),
                full_name: fullName,
                email: email,
                bio: bio,
                email_me: emailMe,
                notify_me: notifyMe,
            })
            .run(conn)
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });
    };

//-----------------------------  GET PROFILE

exports.get = function (userID) {
        var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });
        return c.then(function (conn) {
            return table.get(userID)
                .run(conn)
                // Catch any errors
                .catch(function(err){
                    console.log(err);
                })
                .then(function(result){
                    conn.close();
                    return result;
                })
        });
    };

//----------------------------- GET LOGS
exports.getLogs = function(userID){
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Get all logs by action_by userID
            table.filter({
                action_by: userID
            })
            .run(conn)
            .then(function(cursor){
                return cursor.toArray();
            })
            .then(function(logs){
                console.log(logs);
                return logs;
            })
            // Catch any errors
            .catch(function(err){
                console.log(err);
            })
            // Close the connection
            .finally(function(logs){
                conn.close();
                return logs;
            });
        });
    };


//----------------------------- END
