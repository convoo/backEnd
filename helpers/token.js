/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- TOKENS
// TODO: Save twitter details to rethink

'use strict';

var uuid = require('uuid-js'),
  jwt = require('jsonwebtoken'),
  twitterAPI = require('node-twitter-api');


module.exports = function () {

    var m = {};
    var table = r.db(process.env.RETHINK_DB).table("logs");

    var twitter = new twitterAPI({
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        callback: process.env.TWITTER_CALLBACK
    });

//----------------------------- MAKE ID
    m.makeID = function () {
        return uuid.create().toString();
    };

//----------------------------- MAKE TOKEN
    m.makeJWT = function (userID, userType, url) {
        return jwt.sign({ user_type: userType, user_id: userID, iss: process.env.WEB_SITE }, process.env.AUTH_SECRET);
    };

//----------------------------- READ TOKEN
    m.readJWT = function (authToken) {
        try {
            var token = jwt.verify(authToken, process.env.AUTH_SECRET);
            return { type: token.user_type, user_id: token.user_id };
        } catch (error) {
            console.log(error);
            return { type: 'INVALID'};
        }
    };

//----------------------------- MAKE TWITTER REQUEST TOKEN
    m.makeTwitterRequest = function (callback) {
        twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
            if (error) {
                console.log("Error getting OAuth request token : " + error);
            } else {
                var redirectUrl = twitter.getAuthUrl(requestToken)
                callback(redirectUrl, requestToken, requestTokenSecret);
            }
        });
    };

//----------------------------- MAKE TWITTER ACESS TOKEN
    m.makeTwitterAccess = function (token_secret, request_token, oauth_verifier, callback) {
        twitter.getAccessToken(request_token, token_secret, oauth_verifier, function (error, accessToken, accessTokenSecret, results) {
            if (error) {
                console.log(error);
            } else {
                callback(accessToken, accessTokenSecret);
            }
        });
    };

//----------------------------- TWITTER VERIFY TOKEN
    m.verifyTwitterAccess = function (accessToken, accessTokenSecret, callback) {
        twitter.verifyCredentials(accessToken, accessTokenSecret, function (error, data, response) {
            if (error) {
                callback(error);
            } else {
                callback(data);
            }
        });
    };

//----------------------------- END
    return m;
};


