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

var twitter = new twitterAPI({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callback: process.env.TWITTER_CALLBACK
});

//----------------------------- MAKE ID
exports.makeID = function () {
        return uuid.create().toString();
    };

//----------------------------- MAKE TOKEN
exports.makeJWT = function (userID, userType, url) {
        return jwt.sign({ user_type: userType, user_id: userID, iss: url }, process.env.AUTH_SECRET);
    };

//----------------------------- READ TOKEN
exports.readJWT = function (authToken) {
        try {
            var token = jwt.verify(authToken, process.env.AUTH_SECRET);
            return { type: token.user_type, user_id: token.user_id };
        } catch (error) {
            // console.log(error);
            return { type: 'INVALID'};
        }
    };

//----------------------------- MAKE TWITTER REQUEST TOKEN
exports.makeTwitterRequest = function (callback) {
        twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
            if (error) {
                // console.log("Error getting OAuth request token : " + error);
                // console.log(error);
                callback(redirectUrl, requestToken, requestTokenSecret,error);
            } else {
                var redirectUrl = twitter.getAuthUrl(requestToken)
                callback(redirectUrl, requestToken, requestTokenSecret,error);
            }
        });
    };

//----------------------------- MAKE TWITTER ACESS TOKEN
exports.makeTwitterAccess = function (token_secret, request_token, oauth_verifier, callback) {
        twitter.getAccessToken(request_token, token_secret, oauth_verifier, function (error, accessToken, accessTokenSecret, results) {
            if (error) {
                console.log(error);
            } else {
                callback(accessToken, accessTokenSecret);
            }
        });
    };

//----------------------------- TWITTER VERIFY TOKEN
exports.verifyTwitterAccess = function (accessToken, accessTokenSecret, callback) {
        twitter.verifyCredentials(accessToken, accessTokenSecret, function (error, data, response) {
            if (error) {
                callback(error);
            } else {
                callback(data);
            }
        });
    };
