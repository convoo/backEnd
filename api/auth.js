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
 * @apiSuccess {String} jwt A JWT token that is returned as a cookie.
 *
 */
exports.token = function (req, res) {
    if (!req.body.authToken) {
        var t = (token.makeJWT(token.makeID(), 'visitor', process.env.WEB_SITE));
        res.cookie('jwt', t, { expires: new Date(Date.now() + (2147483647*100)), httpOnly: true });
        res.redirect('/');
    };
}

//----------------------------- MAKE TWITTER REQUEST TOKEN
/**
 * @api {get} /auth/twitter Authenticate with twitter
 * @apiName getTwitter
 * @apiGroup Auth
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 * @apiDescription This endpoint redirects to twitter for authentication.
 * It works closely with getTwitterCallback.
 *
 * @apiSuccess {String} requestToken The request token to twitter - part of cookie
 * @apiSuccess {String} requestTokenSecret The request token secret - part of cookie
 * @apiSuccess {Redirect} redirectUrl The url where the user can authenticate with twitter
 *
 */
exports.twitter = function (req, res) {
    token.makeTwitterRequest(function (redirectUrl, requestToken, requestTokenSecret, err) {
        if (!err) {
            res.cookie('twitterToken', {requestToken: requestToken, requestTokenSecret: requestTokenSecret}, { expires: new Date(Date.now() + 9000000), httpOnly: true });
            res.redirect(redirectUrl);
        }
    })
};

/**
 * @api {get} /auth/twitter/callback Authenticate with twitter callback
 * @apiName getTwitterCallback
 * @apiGroup Auth
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 * @apiDescription This endpoint handles the returns of getTwitter.
 *
 * @apiParam {String} requestToken The request token to twitter - part of cookie
 * @apiParam {String} requestTokenSecret The request token secret - part of cookie
 * @apiParam {String} jwt The JWT - part of cookie
 *
 * @apiSuccess {Redirect} / The home page
 *
 */
//----------------------------- MAKE TWITTER ACESS TOKEN
exports.twitterCallback = function (req, res) {
    var t = req.cookies.twitterToken;
    var userID = token.readJWT(req.cookies.jwt).user_id;
    token.makeTwitterAccess(t.requestTokenSecret, t.requestToken, req.query.oauth_verifier, function (accessToken, accessTokenSecret) {
        token.verifyTwitterAccess(accessToken, accessTokenSecret, function (twitterDetails) {
          // TODO:  possibly change the users JWT cookie
            user.twitterDetails(userID, accessToken, accessTokenSecret, twitterDetails)
        });
        res.cookie('twitterToken', {}, { expires: new Date(Date.now() - 9000000), httpOnly: true });
        res.redirect('/');
    })
};

//----------------------------- LOG OUT
exports.logout = function (req, res) {
    log.add('Logout', token.readJWT(req.body.authToken).user_id, '/auth/logout/');
    // LOGOUT
    res.sendStatus(200).json({ status: 'logout' });
};
