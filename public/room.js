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
    room.socket = io(window.location.origin);

    room.socket.on('server handshake', function (clients) {
        $('#client-panel .panel-body').text(JSON.stringify(clients, null, '  '));

        room.socket.emit('client handshake', JSON.stringify(room.state));
    });

    room.start();
}

room.close = function ()
{
    clearInterval(room.timer);
    console.log("Room closed.");
}
