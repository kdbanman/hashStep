var socket = io(window.location.origin);

import {generate} from 'rand-gen';
var gen = generate(100, 43);
var timer = setInterval(function () {
    var next = gen.next();
    if (next.done) {
        clearInterval(timer);
    } else {
        $('#object-text').text(JSON.stringify(next.value, null, '  '));
        $('#object-view').scrollTop($('#object-view').prop('scrollHeight'));
    }
}, 5)
