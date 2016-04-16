/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- SETUP RETHINK DB
'use strict';

var _ = require("underscore");

module.exports = function () {
    (function () {
        var r = require("rethinkdb");

//-- MAKE DATABASE
        var createDB = r.dbCreate(process.env.RETHINK_DB),
            useDB = r.db(process.env.RETHINK_DB),
            allTables = ["users", "logs", "rooms"];

        // Connect
        var c = r.connect({ host: process.env.RETHINK_HOST, port: process.env.RETHINK_PORT });

        c.then(function(conn){
            r.dbList().run(conn)
                .then(function(allDBs){
                    if(!_.contains(allDBs, process.env.RETHINK_DB)){
                        // Create DB
                        console.log("Creating Database...");
                        createDB.run(conn);
                    }
                })
                .then(function(){
                    // Get all tables
                     return useDB.tableList().run(conn);
                }).then(function(tables){
                    // Calculate missing tables
                    return _.difference(allTables, tables);
                })
                .then(function(tablesToAdd){
                    // Add missing tables
                    if (tablesToAdd.length > 0){
                        console.log("Adding the missing tables",tablesToAdd);
                        tablesToAdd.forEach(function(table){
                            useDB.tableCreate(table).run(conn);
                        });
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
        });
    } ());
};
