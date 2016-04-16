/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- LOGS
            // TODO: RealTime admin logs
            // TODO: Filter Logs By User, room, time
            // TODO: Log JWT tampering
            // TODO: Times on site by user
            // TOFO: Make 2 log types: 1) User did somthing 2) User did somthing to someone

'use strict';

var r = require("rethinkdb");

module.exports = function () {
    var m = {};
    var table = r.db(process.env.RETHINK_DB).table("logs");

//----------------------------- MAKE LOG
    m.add = function (logType, userID, url) {
        // connect
        var c = r.connect({host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT});

        c.then(function(conn){
            // Insert user
            table.insert({
                action_by: userID, // TODO: Insert actual user (Many to Many) instead of userID
                action: logType,
                url: url,
                created_at: r.now()
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

        console.log(logType, "Log created by: ", userID, " at ", url);
    };

//----------------------------- END
    return m;
};
