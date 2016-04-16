
var should = require('chai').should();

describe('Token Helper', function() {

  var token = require('../../helpers/token.js');

  describe('#makeID()', function(){
    var id = token.makeID();

    it('should not be null', function(){
      id.should.not.equal(null);
    });
    it('should be a string',function(){
      id.should.be.a('string');
    });
    it('should be 36 characters long',function(){
      id.length.should.equal(36);
    });
  });

  describe('#makeJWT()', function(){
    require('dotenv').config();
    var id = token.makeID();
    var userType = 'guest';
    var url = 'website.com';

    describe('make JWT from valid inputs', function(){
      var jwt = token.makeJWT(id,userType,url);

      it('should not be null', function(){
        jwt.should.not.equal(null);
      });
      it('should be a string',function(){
        jwt.should.be.a('string');
      });
      it('should have 3 periods', function(){
        jwt.split('.').length.should.equal(3);
      });
    });

    // describe('fail to make JWT from invalid inputs', function(){
    //   it('should fail if no userID', function(){
    //     token.makeJWT(null,userType,url).should.Throw();
    //   })
    // })
  });

  describe('#readJWT()', function () {
    require('dotenv').config();
    var id = token.makeID();
    var userType = 'guest';
    var url = 'website.com';
    var validJWT = token.makeJWT(id, userType, url);
    var invalidJWT = 'asdhoashl/asdashodaslhas.ahos';

    it('should return an object for valid and invalid tokens', function(){
      token.readJWT(validJWT).should.be.an('object');
      token.readJWT(invalidJWT).should.be.an('object');
    });

    it('should have type INVALID for invalid tokens', function () {
      token.readJWT(invalidJWT).type.should.equal('INVALID');
    });

    it('should have type and user_id for valid tokens', function () {
      var t = token.readJWT(validJWT)
      t.type.should.not.equal(null);
      t.user_id.should.not.equal(null);
    });

  });

  describe('#makeTwitterRequest()', function () {
    require('dotenv').config();

    it('should return a redirect URL that is a string', function () {
      token.makeTwitterRequest(function(redirectUrl, requestToken, requestTokenSecret){
        redirectUrl.should.not.be(null);
        redirectUrl.should.be.a('string');
      });
    });

    it('should return a request token that is a string', function () {
      token.makeTwitterRequest(function(redirectUrl, requestToken, requestTokenSecret){
        requestToken.should.not.be(null);
        requestToken.should.be.a('string');
      });
    });

    it('should return a request token secret that is a string', function () {
      token.makeTwitterRequest(function(redirectUrl, requestToken, requestTokenSecret){
        requestTokenSecret.should.not.be(null);
        requestTokenSecret.should.be.a('string');
      });
    });
  });

});
