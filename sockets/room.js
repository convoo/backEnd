'use strict';

var token = require('../helpers/token.js');
var room = require('../models/room.js');


//----------------------------- ADD ROOM
exports.add = function (msg) {
        var userID = token.readJWT(msg.jwt).user_id;
        var roomName = msg.roomName;
        console.log(userID);
        console.log(roomName);
        room.add(userID, roomName);
};

