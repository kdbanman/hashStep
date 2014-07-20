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

var activeClients = {};
var currHash = null;
var expectedPlayers = 3;
app.get('/reset/:expectedPlayers', function (req, res) {
    try {
        expectedPlayers = parseInt(req.params.expectedPlayers);
        activeClients = {};
        currHash = null;
    } catch (e) {
        res.send(500, JSON.stringify(e));
    }

    res.send(200, 'Room reset, waiting for ' + expectedPlayers + ' clients.')
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
// TODO: freedom to connect, behavior on disconnect, and maybe other things
//       are completely different after transition to running state when
//       all are connected.
//       (remember, the room is dumb.  all connected --> running.  "readiness"
//       is an app-level consideration)
ioSrv.on('connection', function (socket) {
    
    console.log('Connection from %d', socket.session.id);

    // if room isn't full, perform handshake
    if (Object.keys(activeClients).length < expectedPlayers) {
        // add client to active list by session id
        activeClients[socket.session.id] = 'CONNECTED';

        // notify all clients of new connection
        ioSrv.emit('change', activeClients);
        socket.emit('change', activeClients);

        // send current client data,
        // expect current state hash (seed verification) as response
        socket.emit('server handshake', activeClients);

        // process handshake response
        socket.on('client handshake', function (clientHash) {
            
            console.log('Handshake from %d', socket.session.id);
            console.log('  ' + clientHash);
            
            if (currHash === null) currHash = clientHash;

            if (clientHash === currHash) {
                activeClients[socket.session.id] = 'VERIFIED';
                // inform client of correct seed
                socket.emit('seed verified', activeClients);
                // notify all clients of verification
                ioSrv.emit('change', activeClients);
                socket.emit('change', activeClients);
            } else {
                activeClients[socket.session.id] = 'ERR: BAD SEED';
                // inform client of bad seed
                socket.emit('bad seed', activeClients);
                // notify all clients of bad seed
                ioSrv.emit('change', activeClients);
                socket.emit('change', activeClients);
            }
        });
    } else {
        console.log('%d rejected - room full.', socket.session.id);
    }

    // report disconnections
    socket.on('disconnect', function() {
        console.log('Disconnection from %d', socket.session.id);
        delete activeClients[socket.session.id];
                
        // notify all clients of disconnection
        ioSrv.emit('change', activeClients);

        //TODO: if room has started and not been closed, add socket session
        //      to allowedReconnect list
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
