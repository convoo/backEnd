
'use strict';

var Fetch = require('../helpers/fetch');


exports.url = function (req, res) {
    Fetch.url(req.query.url)
        .then(function(data){
            res.json(data);
        });
}


