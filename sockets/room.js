'use strict';

var token = require('../helpers/token.js');
var room = require('../models/room.js');

module.exports = function(){
    var m = {};

//----------------------------- ADD ROOM
    m.add = function (msg) {
           var userID = token.readJWT(msg.jwt).user_id;
           var roomName = msg.roomName;
           console.log(userID);
           console.log(roomName);
           room.add(userID, roomName);
    };

    return m;
}
