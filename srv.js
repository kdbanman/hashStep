var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var io = require('socket.io');
var _ = require('underscore');

var app = express();
var server = http.Server(app)
var ioSrv = io(server)

// log request/response activity in dev mode
app.use(logger('dev'));

// try to serve requests as static file requests from the public/ directory
app.use(express.static(path.join(__dirname, 'public')));

// receive client socket connections
ioSrv.on('connection', function (socket) {

    // report disconnections
    socket.on('disconnect', function() {
        console.log('Disconnection from %s', "TODO");
    });

    // report errors (socket.io error event and my own)
    socket.on('error', function(err) {
        console.error('ERROR from %s:', "TODO");
        console.error('    ' + JSON.stringify(err));
    });
    socket.on('client error', function(err) {
        console.error('ERROR from %s:', "TODO");
        console.error('    ' + JSON.stringify(err));
    });
});

// start the app server on port 8081
server.listen(8081);
console.log('hashStep server listening on port 8081');
