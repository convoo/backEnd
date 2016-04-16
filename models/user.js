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

module.exports = function () {
    var m = {};

    var table = r.db(process.env.RETHINK_DB).table("users");

//----------------------------- ADD USER
    m.add = function (userType, userID, socketID, url) {

        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Insert user
            table.insert({
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
                console.log(err);
            })
            // Close the connection
            .finally(function(){
                conn.close();
            });
        });

        // make log
        log.add('New ' + userType +'!', userID, url);
    };

 //----------------------------- SEEN USER

 m.seen = function (userID, socketID, url) {

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
        log.add('Updated Socket ID!', userID, url);
 };

  //----------------------------- DISCONECTED USER

 m.disconnect = function (socketID) {

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


    m.twitterDetails = function (userID, accessToken, accessTokenSecret, twitterDetails) {

        var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });
        c.then(function (conn) {
            // Insert user
            table.update({

            })
                .run(conn)
            // Catch any errors
                .catch(function (err) {
                    console.log(err);
                })
            // Close the connection
                .finally(function () {
                    conn.close();
                });
        });

        // make log
  log.add('Upgrade visitor to user ', userID, "/");

    };


//----------------------------- UPGRADE USER
    m.upgrade = function (userID, photoOriginal, twitterID, lastUpdated) {
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
    m.del = function (userID) {
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

        // make log
        log.add('Delete User ' + userID, userID, "/");
    };

//----------------------------- MAKE USER ADMIN
    m.makeAdmin = function(userID, byUserID){
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

    m.onlineAll = function(callback){
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

    m.edit = function(userID, fullName, email, bio, emailMe, notifyMe){
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

    m.get = function (userID) {
        var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });
        return c.then(function (conn) {
            return table.get(userID)
                .run(conn);
        });
    };

//----------------------------- GET LOGS
    m.getLogs = function(userID){
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
    return m;
};
