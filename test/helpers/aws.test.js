
var should = require('should');

describe('AWS Helper', function(){

    var awsHelper = require('../../helpers/aws.js');

    describe('#s3PutBase64()', function(){


        it('should save image to S3', function(done) {
            var image = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
            var folder = 'test';
            var imageName = 'test';

            awsHelper.s3PutBase64(image, folder, imageName)
            .then(function(data) {
                data.ETag.should.not.be.null;
                done()
            });
       });


         it('should return an ETag of 34 charectors', function(done) {
            var image = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
            var folder = 'test';
            var imageName = 'test';

            awsHelper.s3PutBase64(image, folder, imageName)
            .then(function(data) {
                data.ETag.length.should.equal(34);
                done()
            });
       });




    })
})
