/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- ROOMS
              // TODO: count / who has been in this room
              // TODO: count / who is in this room
              // TODO: Discuss, can a room be scheduled to open/close in the future?
              // TODO: Discuss, will there be diferent types of rooms?
              // TODO: Discuss, will rooms have a launguage setting?
              // TODO: Discuss, will rooms have age restrictions/content rating?
              // TODO: Discuss, can certain users be prevented from partaking in a specific room? If so who decides?
              // TODO: Discuss, can users invite others via twitter to join a room?
              // TODO: Discuss, can users anonaymously partake in a room?
              // TODO: Discuss, can rooms have widgets, who can add them?
              // TODO: Discuss, will rooms have ceategories or tags or none?

'use strict';

var r = require("rethinkdb");
var log = require('./log.js');
var User = require('./user');
var slug = require('slug');
var table = r.db(process.env.RETHINK_DB).table("rooms");


//----------------------------- ADD ROOM
exports.add = function (userID, roomData) {
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});
        var today = new Date();

        return c.then(function(conn){
            return User.get(userID).then(function(user){
                // Insert room
                return table.insert({
                    title: roomData.title,
                    canJoin: roomData.canJoin,
                    sharedUrl: roomData.url,
                    description: roomData.description,
                    // slug: slug(roomData.title) + "-@" + user.user_name + "-" + today.getUTCDate + "-" + today.toLocaleString("en-us", {month: "short"}) + "-" + today.getFullYear,
                    // TODO: Create function for URL shortener for room URL
                    // TODO: Add short URL for each room to database
                    // TODO: Handle rooms with the same name by prepending the user name of the creator and postpending a version number of the user makes more that one room with the same name
                    created_at: r.now(),
                    created_by: user.id
                })
                // TODO: Add room created by UserId
                .run(conn)
                // Catch any errors
                .catch(function(err){
                    console.log(err);
                })
                // Close the connection
                .then(function(result){
                    conn.close();
                    return result;
                })
            });
        });

        // make log
        // log.add('New Room', userID, roomName);
    };

//----------------------------- DELETE ROOM
exports.get = function (roomID) {
    var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });
    return c.then(function (conn) {
        return table.get(roomID)
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

exports.getBySlug = function (roomSlug) {
    var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });
    return c.then(function (conn) {
        return table.filter({slug: roomSlug})
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

//----------------------------- DELETE ROOM
exports.del = function (userID, roomID) {
        // connect
    var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

    c.then(function(conn){
        // Insert user
        table.get(roomID).update({
            deleted_at: r.now()
            // TODO: Add room closed by UserId
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
    // log.add('Delete Room ' + roomID, userID, "/");
};

exports.forceDelete = function (roomID) {
    // connect
    var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

    return c.then(function(conn){
        // Insert user
        return table.get(roomID)
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
//----------------------------- END
