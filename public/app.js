room.state.seed = 42;
room.state.size = 42;

import {generate} from 'rand-gen';

var gen = generate(room.state.seed, room.state.size);
room.loop = function ()
{
    var next = gen.next();
    if (next.done) {
        room.close();
    } else {
        room.state.obj = next.value;
        $('#object-text').text(JSON.stringify(next.value, null, '  '));
        $('#object-view').scrollTop($('#object-view').prop('scrollHeight'));
    }
}

room.start();
