var room = {};

room.socket = io(window.location.origin);

room.state = {};

room.loop = function ()
{
    console.log("ERROR: room.loop() function must be defined!");
};

room.start = function ()
{
    room.timer = setInterval(room.loop, 5);
}

room.close = function ()
{
    clearInterval(room.timer);
    console.log("Room closed.");
}
