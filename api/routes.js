///////////////----------------------------- ROUTES
'use strict';

module.exports = function (app) {

  var api = require('./controllers.js');


//---INDEX
    app.route('/')                          .get(api.index);

 //---AUTH
    app.route('/auth/token/')               .get(api.auth.token);                //Make JWT
    app.route('/auth/twitter/')             .get(api.auth.twitter);              //Make Twitter Request Token
    app.route('/auth/twitter/callback/')    .get(api.auth.twitterCallback);      //Handle callback from Twitter
    app.route('/auth/logout/')              .get(api.auth.logout);
//---USERS
    app.route('/user/:userID/delete')      .get(api.user.del);
    app.route('/user/:userID/profile')     .get(api.user.profile);
    app.route('/user/:userID/logs')        .get(api.user.logs);
//---CATCH ALL
    app.route('/*').get(function (req, res) {
        res.sendStatus(404);
    });

};




