///////////////----------------------------- ROUTES 
'use strict';

module.exports = function (app, r) {  
   
   var api = require('./controllers')(r);
   
 //---AUTH  
    app.route('/auth/token/')               .get(api.authToken);                //Make JWT
    app.route('/auth/twitter/')             .get(api.authTwitter);              //Make Twitter Request Token
    app.route('/auth/twitter/callback/')    .get(api.authTwitterCallback);      //Handle callback from Twitter
    app.route('/auth/logout/')              .get(api.authLogout);
//---USERS
    app.route('/user/delete/:userID')      .get(api.userDelete);
    app.route('/user/profile/:userID')     .get(api.userProfile);
    app.route('/user/logs/:userID')        .get(api.userLogs);
//---CATCH ALL
    app.route('/*').get(function (req, res) {
        res.sendStatus(404);
    });
    
};




