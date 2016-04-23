'use strict';

var token = require('../helpers/token.js');
var user = require('../models/user.js');
var log = require('../models/log.js');


    //----------------------------- MAKE JWT TOKEN
exports.token = function (req, res) {
    if (!req.body.authToken) {
        var t = (token.makeJWT(token.makeID(), 'visitor', process.env.WEB_SITE));
        res.cookie('jwt', t, { expires: new Date(Date.now() + (2147483647*100)), httpOnly: true });
        res.redirect('/');
    };
}

//----------------------------- MAKE TWITTER REQUEST TOKEN
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
exports.twitterCallback = function (req, res) {
    var t = req.body.twitterToken;
    var userID = token.readJWT(req.body.jwt).user_id;
    token.makeTwitterAccess(t.requestTokenSecret, t.requestToken, t.oauth_verifier, function (accessToken, accessTokenSecret) {
        token.verifyTwitterAccess(accessToken, accessTokenSecret, function (twitterDetails) {
            // TODO:  possibly change the users JWT cookie
            user.twitterDetails(userID, accessToken, accessTokenSecret, twitterDetails)
                .catch(function(err){
                    console.log(err);
                    res.json({status: "Error", error: err});
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
