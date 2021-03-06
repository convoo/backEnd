/* global process */
/* global require */
/* global console */
/* global module */

// TODO: Figure out cloud front

///////////////----------------------------- AWS

'use strict';

var aws = require('aws-sdk');

//----------------------------- BASE64 to S3
exports.s3PutBase64 = function (image, folder, imageName) {
      return new Promise(function(resolve, reject) {

        var buf = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        var s3 = new aws.S3();

        aws.config = { "accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY };

        s3.putObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: folder + '/' + imageName,
            Body: buf,
            ACL: 'public-read',
            ContentType: "image/png",
            ContentEncoding: "base64"

        }, function (error, data) {
            if (error){
                reject(error);
            } else {
                resolve(data);
            }
        });
        
        
      });
    }
    
    

    
//----------------------------- END
