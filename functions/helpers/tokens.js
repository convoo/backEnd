/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- TOKENS
// TODO: Save twitter details to rethink 
            
'use strict';
module.exports = function (r, uuid, twitter, jwt) {
    
    var m = {};
    var table = r.db(process.env.RETHINK_DB).table("logs");

//----------------------------- MAKE ID
    m.makeID = function () {
        return uuid.create().toString();
    };

//----------------------------- MAKE TOKEN
    m.makeToken = function (userID, userType, url) {
        return jwt.sign({ user_type: userType, user_id: userID, iss: process.env.WEB_SITE }, process.env.AUTH_SECRET);
    };

//----------------------------- READ TOKEN
    m.readToken = function (authToken) {
        try {
            var token = jwt.verify(authToken, process.env.AUTH_SECRET);
            return { type: token.user_type, user_id: token.user_id };
        } catch (error) {
            console.log(error);
            return { type: 'INVALID'};
        }
    };
    
//----------------------------- MAKE TWITTER REQUEST TOKEN
    m.makeTwitterRequestToken = function (callback) {
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
    m.makeTwitterAccessToken = function (token_secret, request_token, oauth_verifier, callback) {       
        twitter.getAccessToken(request_token, token_secret, oauth_verifier, function (error, accessToken, accessTokenSecret, results) {
            if (error) {
                console.log(error);
            } else {
                callback(accessToken, accessTokenSecret);
            }
        });
    };

//----------------------------- TWITTER VERIFY TOKEN
    m.verifyTwitterAccessToken = function (accessToken, accessTokenSecret, callback) { 
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


