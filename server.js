/* global process */
/* global require */
/* global console */
/* global module */
/* global __dirname */
///////////////----------------------------- SERVER
'use strict';

require('dotenv').config();

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    cookieParser = require('cookie-parser');


 app.use(cookieParser());
//-- SERVE STATIC FILES
app.use(express.static('public'));

//--RETHINK SETUP
require('./setupRethink.js');

//--SOCKETS
exports.io = require('./sockets/events.js')(io);

//--API
var bodyParser = require('body-parser'),
    compression = require('compression');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

require('./api/routes.js')(app);

//--START SERVER
server.listen(process.env.WEB_PORT, function () {
    // console.info('Command + Double Click http://www.website.com:' + process.env.WEB_PORT);
});

exports.server = server;
