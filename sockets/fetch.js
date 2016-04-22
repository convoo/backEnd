
'use strict';

var Fetch = require('../helpers/fetch');


exports.url = function (socket, io, msg) {
    if (msg != undefined && msg.url != null) {
        Fetch.url(msg.url)
        .then(function(data){
            io.to(socket.id).emit('resFetchUrl', data);
        });
    }

}


