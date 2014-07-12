var express = require('express');
var Cookies = require('cookies');
var session = require('cookie-session');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var io = require('socket.io');
var _ = require('underscore');

var app = express();
var server = http.Server(app)
var ioSrv = io(server)

/*******************
 * Express
 ******************/

// log request/response activity in dev mode
app.use(logger('dev'));

// global sessions for unique {machine, user-agent} tracking
var sessionName = 'sess';
var sessionSecret = 'github-public';
app.use(session({name: sessionName, secret: sessionSecret}));

// manage session on each request
var sessionID = 0;
app.use(function (req, res, next) {
    req.session.id = req.session.id || ++sessionID;

    req.session.views = req.session.views || 0;
    req.session.views += 1;

    next();
});

// try to serve requests as static file requests from the public/ directory
app.use(express.static(path.join(__dirname, 'public')));

/*******************
 * Socket.io
 ******************/

// augment socket with session object
ioSrv.use(function (socket, next) {
    // TODO research ways for this to be less hacky
    // XXX for production gameruum, use a session store with cookies for IDs.
    //     that way, a more portable middleware could be written, like 
    //     session.socket.io, but without wrapping all socket.io#Server methods.
    var signedCookies = new Cookies(socket.request, null, [sessionSecret]);
    var encoded = signedCookies.get(sessionName, {signed: true});
    var decoded = new Buffer(encoded, 'base64').toString('utf8');
    socket.session = JSON.parse(decoded);

    next()
});

// receive client socket connections
ioSrv.on('connection', function (socket) {

    // report disconnections
    socket.on('disconnect', function() {
        console.log('Disconnection from %d', socket.session.id);
    });

    // report errors (socket.io error event and my own)
    socket.on('error', function(err) {
        console.error('ERROR from %d:', socket.session.id);
        console.error('    ' + JSON.stringify(err));
    });
    socket.on('client error', function(err) {
        console.error('ERROR from %d:', socket.session.id);
        console.error('    ' + JSON.stringify(err));
    });
});

// start the app server on port 8081
server.listen(8081);
console.log('hashStep server listening on port 8081');
