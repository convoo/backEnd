'use strict';

var token = require('../helpers/token.js');
var user = require('../models/user.js');
var log = require('../models/log.js');


    //----------------------------- MAKE JWT TOKEN
/**
 * @api {get} /auth/token Get a new token
 * @apiName getToken
 * @apiGroup Auth
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} jwt A new JWT token
 *
 */
exports.token = function (req, res) {
    if (!req.body.authToken) {
        var t = (token.makeJWT(token.makeID(), 'visitor', process.env.WEB_SITE));
        res.json({jwt: t});
    };
}

//----------------------------- MAKE TWITTER REQUEST TOKEN
/**
 * @api {get} /auth/twitter Get data to authenticate with twitter
 * @apiName getTwitter
 * @apiGroup Auth
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 *
 * @apiSuccess {String} requestToken The request token to twitter
 * @apiSuccess {String} requestTokenSecret The request token secret
 * @apiSuccess {String} redirectUrl The url to send the user for them to login with twitter
 */
exports.twitter = function (req, res) {
    token.makeTwitterRequest(function (redirectUrl, requestToken, requestTokenSecret, err) {
        if (!err) {
            res.json({
                requestToken: requestToken,
                requestTokenSecret: requestTokenSecret,
                redirectUrl: redirectUrl
            });
        }
    })
};

//----------------------------- MAKE TWITTER ACESS TOKEN
/**
 * @api {get} /auth/twitter/callback Authenticate with twitter callback
 * @apiName getTwitterCallback
 * @apiGroup Auth
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 * @apiDescription This endpoint handles the returns of logging in to twitter.
 * The user will be updated with any information from twitter that wasn't available.
 *
 * @apiParam {Object} twitterToken The object that contains requestToken, requestTokenSecret and oauthVerifier
 * @apiParam {String} requestToken The request token to twitter
 * @apiParam {String} requestTokenSecret The request token secret
 * @apiParam {String} oauthVerifier The verifier received from twitter after authenticating
 * @apiParam {String} jwt The authetnicating user's JWT
 *
 * @apiSuccess {String} status Success
 * @apiSuccess {String} message That the user logged in
 *
 * @apiError {String} status Error
 * @apiError {String} message The error message
 *
 */
exports.twitterCallback = function (req, res) {
    var t = req.body.twitterToken;
    var userID = token.readJWT(req.body.jwt).user_id;
    token.makeTwitterAccess(t.requestTokenSecret, t.requestToken, t.oauthVerifier, function (accessToken, accessTokenSecret) {
        token.verifyTwitterAccess(accessToken, accessTokenSecret, function (twitterDetails) {
            // TODO:  possibly change the users JWT cookie
            user.twitterDetails(userID, accessToken, accessTokenSecret, twitterDetails)
                .catch(function(err){
                    console.log(err);
                    res.json({status: "Error", message: err});
                })
                .then(function(){
                    res.json({status: "Success", message: "User logged in"});
                });
        });
    });
};

//----------------------------- LOG OUT
exports.logout = function (req, res) {
    log.add('Logout', token.readJWT(req.body.authToken).user_id, '/auth/logout/');
    // LOGOUT
    res.sendStatus(200).json({ status: 'logout' });
};
