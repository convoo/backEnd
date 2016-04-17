/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- CONTROLLERS
'use strict';

var user = require('./user.js'),
    auth = require('./auth.js'),
    fetch = require('./fetch.js');

exports.index = function(req, res){
        res.json({
            message: "Welcome to Convoo's API"
        })
    }

exports.user = user;
exports.auth = auth;
exports.fetch = fetch;
