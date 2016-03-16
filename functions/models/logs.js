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

module.exports = function (r, tokens) {
    var m = {};
    var table = r.db(process.env.RETHINK_DB).table("logs");

//----------------------------- MAKE LOG
    m.makeLog = function (logType, userID, url) {     
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
 
//----------------------------- GET LOGS
    m.getUserLogs = function(userID){
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