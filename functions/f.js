/* global require */
/* global module */
///////////////----------------------------- F
'use strict';

module.exports = function(r, uuid, twitter, jwt, aws){
    var m = {};
    
    m.aws = require('./helpers/aws.js')(r, aws);
    
    m.tokens = require('./helpers/tokens.js')(r, uuid, twitter, jwt);
    
    m.logs = require('./models/logs.js')(r, m.tokens);
    
    m.rooms = require('./models/rooms.js')(r, m.logs);
    
    m.users = require('./models/users.js')(r, m.logs);
    
    return m;
};