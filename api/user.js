'use strict';

var token = require('../helpers/token.js');
var user = require('../models/user.js');
var log = require('../models/log.js');

  //--------------- USERS

exports.del = function (req, res) {
        log.add('Delete User', token.readJWT(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/delete/');
        user.del(token.readJWT(req.body.authToken).user_id, Date.now())
        res.sendStatus(200).json({ Deleted: 'true' });
    };

exports.profile = function (req, res) {
        log.add('Update Profile', token.readJWT(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/profile/');
        user.edit(token.readJWT(req.body.authToken).user_id, req.body.photo, req.body.twitterID, Date.now());
        res.sendStatus(200).json({ Updated: 'true' });
    };
/**
 * @api {get} /user/:id/logs Request all logs by a user
 * @apiName getUserLogs
 * @apiGroup User
 * @apiPermission Admin
 * 
 * @apiSuccess {Array} logs An array of log objects associated with the user
 * @apiError UserNotFound The id of the User was not found.
 * 
 */
exports.logs = function (req, res) {
        log.add('Get Logs', token.readJWT(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/logs/');
        res.sendStatus(200).json('log');
    };

