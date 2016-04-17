'use strict';

var should = require('should');
var Token = require('../../helpers/token');


describe('User Model', function () {
    require('dotenv').config();
    var User = require('../../models/user');
    var userType = 'Guest',
        userID = Token.makeID(),
        socketID = Token.makeID();

    // Tests several functions at once
    // TODO: Figure out how to separate and test in unit tests
    it('should add, get and force delete a user', function (done) {
        User.add('Guest', userID, socketID)
        .then(function(result){
            return User.get(userID);
        }).then(function(result){
            result.should.be.an.Object();
            result.id.should.equal(userID);
            return result.id;
        }).then(function(addedID){
            return User.forceDelete(addedID);
        }).then(function(){
            return User.get(userID);
        }).then(function(result){
            should.not.exist(result);
        })
        .then(function(){
            done();
        });
    });
});
