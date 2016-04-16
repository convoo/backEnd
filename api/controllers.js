/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- CONTROLLERS
'use strict';

var user = require('./user.js'),
  auth = require('./auth.js');

module.export = function () {

    var m = {};

    m.index = function(req, res){
        res.json({
            message: "Welcome to Convoo's API"
        })
    };

    m.user = user;
    m.auth = auth;

    return m;
}



