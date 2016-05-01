/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- CONTROLLERS
'use strict';

var user = require('./user.js'),
    auth = require('./auth.js'),
    fetch = require('./fetch.js');

/**
 * @api {get} / Check API
 * @apiName checkApi
 * @apiGroup Home
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} message A welcome message
 *
 */
exports.index = function(req, res){
        res.json({
            message: "Welcome to Convoo's API"
        })
    }

exports.user = user;
exports.auth = auth;
exports.fetch = fetch;
