'use strict';

var should = require('should');
var Token = require('../../helpers/token');


describe('User Model', function () {
    require('dotenv').config();
    var User = require('../../models/user');


    describe('Adding a User', function () {
        var userType = 'Guest',
            userID = Token.makeID(),
            socketID = Token.makeID();

        it('should add a user to the database', function (done) {
            User.add('Guest', userID, socketID)
            .then(function(result){
                console.log(result);
                return User.get(userID);
            }).then(function(result){
                console.log("Get Result: ",result);
                result.should.be.an.Object();
                result.id.should.equal(userID);
                return result.id;
            }).then(function(addedID){
                console.log(addedID);
                return User.forceDelete(addedID);
            }).then(function(deleted){
                console.log(deleted);
                done();
            });
        });
    });

});
