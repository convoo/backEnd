'use strict';

var token = require('../helpers/token.js');
var room = require('../models/room.js');


//----------------------------- ADD ROOM
exports.add = function (msg) {
        var userID = token.readJWT(msg.jwt).user_id;
        var roomName = msg.roomData;
        // console.log(userID);
        // console.log(roomData);
        return room.add(userID, roomData);
};

