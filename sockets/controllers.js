/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- CONTROLLERS
'use strict';

var auth = require('./auth.js');
var user = require('./user.js');
var room = require('./room.js');

module.exports = function(){
    var m = {};

    m.auth = auth;
    m.user = user;
    m.room = room;

    return m;
};
