'use strict';

var token = require('../helpers/token.js');
var user = require('../models/user.js');
var log = require('../models/log.js');

module.exports = function () {

  var m = {};

  //--------------- USERS

    m.del = function (req, res) {
        log.add('Delete User', token.readJWT(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/delete/');
        user.del(token.readJWT(req.body.authToken).user_id, Date.now())
        res.sendStatus(200).json({ Deleted: 'true' });
    };

    m.profile = function (req, res) {
        log.add('Update Profile', token.readJWT(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/profile/');
        user.edit(token.readJWT(req.body.authToken).user_id, req.body.photo, req.body.twitterID, Date.now());
        res.sendStatus(200).json({ Updated: 'true' });
    };

    m.logs = function (req, res) {
        log.add('Get Logs', token.readJWT(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/logs/');
        res.sendStatus(200).json('log');
    };

    return m;

}
