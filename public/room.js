var room = {};

room.state = {};

room.loop = function ()
{
    console.log("ERROR: room.loop() function must be defined!");
};

room.start = function ()
{
    room.timer = setInterval(room.loop, 5);
}

room.ready = function ()
{
    // create connection to socket server
    room.socket = io(window.location.origin);

    // define socket events
    room.socket.on('server handshake', function (clients) {
        //XXX should probably call an api-level room.connectionChange(newStatus) function or something, because this is app-level:
        $('#client-panel .panel-body').text(JSON.stringify(clients, null, '  '));
        room.socket.emit('client handshake', JSON.stringify(room.state));
    });

    room.socket.on('change', function (clients) {
        //DEBUG
        console.log('change');

        //XXX should probably call an api-level room.connectionChange(newStatus) function or something, because this is app-level:
        $('#client-panel .panel-body').text(JSON.stringify(clients, null, '  '));
    });

    room.start();
}

room.close = function ()
{
    clearInterval(room.timer);
    console.log("Room closed.");
}
