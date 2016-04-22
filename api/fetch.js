
'use strict';

var Fetch = require('../helpers/fetch');

/**
 * @api {get} /fetch/?url Request details about a url
 * @apiName fetchUrlDetails
 * @apiGroup Fetch
 * @apiPermission Public
 * @apiVersion 0.0.1
 *
 * @apiParam {String} url The encoded url to get details about
 *
 * @apiSuccess {String} title The title of the url
 * @apiSuccess {String} description The description of the url
 * @apiSuccess {String} image The url of the main image for the url
 * @apiSuccess {Array} tags An array of strings that are tags/keywords for the url
 */
exports.url = function (req, res) {
    Fetch.url(req.query.url)
        .then(function(data){
            res.json(data);
        });
}


