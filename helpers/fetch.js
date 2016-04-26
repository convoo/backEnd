
'use strict';

var     fetch = require('node-fetch'),
        cheerio = require('cheerio');


exports.url = function (url) {
    return fetch(url).then(function(urlRes){
        return urlRes.text();
    }).then(function(body){
        var $ = cheerio.load(body);

        var title, description, image, tags;

        // Title
        if ($("meta[property='og:title']").attr('content') != null) {
            var title = $("meta[property='og:title']").attr('content');
        } else if ($("meta[name='twitter:title']").attr('content') != null) {
            var title = $("meta[name='twitter:title']").attr('content');
        } else {
            var title = $('title').text();
        }

        // Description
        if ($("meta[property='og:description']").attr('content')){
            description = $("meta[property='og:description']").attr('content');
        } else if ($("meta[name='twitter:description']").attr('content')) {
            description = $("meta[name='twitter:description']").attr('content');
        } else if ($("meta[name='description']").attr('content')) {
            description = $("meta[name='description']").attr('content');
        }

        // Image
        if ($("meta[property='og:image']").attr('content')) {
            image = $("meta[property='og:image']").attr('content');
        } else if ($("meta[name='twitter:image:src']").attr('content')) {
            image = $("meta[name='twitter:image:src']").attr('content');
        } else if ($("meta[name='twitter:image']").attr('content')) {
            image = $("meta[name='twitter:image']").attr('content');
        }

        // Tags
        if ($("meta[property='og:keywords']").attr('content')) {
            tags = $("meta[property='og:keywords']").attr('content').split(',');
        } else if ($("meta[name='keywords']").attr('content')) {
            tags = $("meta[name='keywords']").attr('content').split(',');
        }
        if(tags !== undefined){
            tags = tags.map(function(tag){
                return tag.trim().replace(" ", "-");
            });
        }

        return {
            title: title,
            description: description,
            tags: tags,
            image: image,
        }

    }).catch(function(err){
        console.log(err);
        res.json({
            error: "Uh oh, something bad happened"
        });
    });
}


