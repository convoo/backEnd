/* global process */
/* global require */
/* global console */
/* global module */
///////////////----------------------------- CONTROLLERS 
'use strict';

var uuid = require('uuid-js'),
    jwt = require('jsonwebtoken'),
    twitterAPI = require('node-twitter-api'),
    aws = require('aws-sdk'),
    fetch = require('node-fetch'),
    cheerio = require('cheerio');
    
var twitter = new twitterAPI({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callback: process.env.TWITTER_CALLBACK
});

module.exports = function (r) {
    
    var m = {};
    var f = require('../functions/f.js')(r, uuid, twitter, jwt, aws);
    
    
    m.index = function(req, res){
        res.json({
            message: "Welcome to Convoo's API" 
        })
    }

//----------------------------- MAKE JWT TOKEN 
    m.authToken = function (req, res) {
        if (!req.body.authToken) {
            var token = (f.tokens.makeToken(f.tokens.makeID(), 'visitor', process.env.WEB_SITE));
            res.cookie('jwt', token, { expires: new Date(Date.now() + (2147483647*100)), httpOnly: true });
            res.redirect('/');
        };
    }
    
//----------------------------- MAKE TWITTER REQUEST TOKEN
    m.authTwitter = function (req, res) {        
        f.tokens.makeTwitterRequestToken(function (redirectUrl, requestToken, requestTokenSecret) {
            res.cookie('twitterToken', {requestToken: requestToken, requestTokenSecret: requestTokenSecret}, { expires: new Date(Date.now() + 9000000), httpOnly: true });
            res.redirect(redirectUrl);
        })
    };
    
   //----------------------------- MAKE TWITTER ACESS TOKEN 
    m.authTwitterCallback = function (req, res) {
        var token = req.cookies.twitterToken;
        var userID = f.tokens.readToken(req.cookies.jwt).user_id;
        f.tokens.makeTwitterAccessToken(token.requestTokenSecret, token.requestToken, req.query.oauth_verifier, function (accessToken, accessTokenSecret) {
            f.tokens.verifyTwitterAccessToken(accessToken, accessTokenSecret, function (twitterDetails) {
               // TODO:  possibly change the users JWT cookie
                    res.redirect('/');  
                f.users.twitterDetails(userID, accessToken, accessTokenSecret, twitterDetails) 
            });
            res.cookie('twitterToken', {}, { expires: new Date(Date.now() - 9000000), httpOnly: true });
        })
    };
        
   //----------------------------- LOG OUT 
    m.authLogout = function (req, res) {
        f.logs.makeLog('Logout', f.tokens.readToken(req.body.authToken).user_id, '/auth/logout/');
        // LOGOUT
        res.sendStatus(200).json({ status: 'logout' });
    };


    //--------------- USERS

    m.userDelete = function (req, res) {
        f.logs.makeLog('Delete User', f.tokens.readToken(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/delete/');
        f.users.deleteUser(f.tokens.readToken(req.body.authToken).user_id, Date.now())
        res.sendStatus(200).json({ Deleted: 'true' });
    };

    m.userProfile = function (req, res) {
        f.logs.makeLog('Update Profile', f.tokens.readToken(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/profile/');
        f.users.updateUser(f.tokens.readToken(req.body.authToken).user_id, req.body.photo, req.body.twitterID, Date.now());
        res.sendStatus(200).json({ Updated: 'true' });
    };

    m.userLogs = function (req, res) {
        f.logs.makeLog('Get Logs', f.tokens.readToken(req.body.authToken).user_id, Date.now(), '/user/' + req.params.userID + '/logs/');
        var log = gun.get('user/' + req.params.userID).path('logs').map()//.val();
        res.sendStatus(200).json('log');
    };
    
    m.fetchUrl = function (req, res) {
        console.log("Fetching url...");
        console.log(req.query.url);
        fetch(req.query.url).then(function(urlRes){
            return urlRes.text();
        }).then(function(body){
            var $ = cheerio.load(body);
            
            var title, description, image, tags;
            
            // Title
            if ($("meta[property='og:title']").attr('content') != null) {
                var title = $("meta[property='og:title']").attr('content');
            } else if ($("meta[name='twitter:title']").attr('content') != null) {
                var title = $("meta[name='twitter:title']").attr('content');
            } else {
                var title = $('title').text();
            }
            
            // Description
            if ($("meta[property='og:description']").attr('content')){
                description = $("meta[property='og:description']").attr('content');
            } else if ($("meta[name='twitter:description']").attr('content')) {
                description = $("meta[name='twitter:description']").attr('content');
            } else if ($("meta[name='description']").attr('content')) {
                description = $("meta[name='description']").attr('content');
            }
            
            // Image
            if ($("meta[property='og:image']").attr('content')) {
                image = $("meta[property='og:image']").attr('content');
            } else if ($("meta[name='twitter:image:src']").attr('content')) {
                image = $("meta[name='twitter:image:src']").attr('content');
            } else if ($("meta[name='twitter:image']").attr('content')) {
                image = $("meta[name='twitter:image']").attr('content');
            }
            
            // Tags
            if ($("meta[property='og:keywords']").attr('content')) {
                tags = $("meta[property='og:keywords']").attr('content').split(',');
            } else if ($("meta[name='keywords']").attr('content')) {
                tags = $("meta[name='keywords']").attr('content').split(',');
            }
            tags = tags.map(function(tag){
                return tag.trim().replace(" ", "-");
            });
            
            return {
                title: title,
                description: description,
                tags: tags,
                image: image,
            }
            
        }).catch(function(){
            res.json({
                error: "Uh oh, something bad happened"
            });
        }).then(function(data){
            res.json(data);
        });
    }

    return m;
}



