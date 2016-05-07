'use strict';

var User = require('../models/user.js');

//----------------------------- ON EDIT PROFILE
exports.editProfile = function (msg) {
    return User.edit(msg.userID, msg.userData);
};


//----------------------------- ON GET PROFILE
exports.getProfile = function (msg) {
    return User.get(msg.userID);
};

//----------------------------- ONLINE USERS STREAM
exports.onlineUsers = function () {
    return User.onlineAll();
};
