// 'use strict';

// var should = require('should');
// var Token = require('../../helpers/token.js');


// describe('Room Model', function () {
//     require('dotenv').config();
//     var User = require('../../models/user');
//     var userType = 'Guest',
//         userID = Token.makeID(),
//         socketID = Token.makeID();
//     var Room = require('../../models/room');
//     var roomData = {
//         title: "This is a test title",
//         canJoin: true,
//         description: "This is a very long description about the room.",
//     }


//     beforeEach(function (done) {
//         User.add('Guest', userID, socketID)
//             .then(function(){
//                 done();
//             });

//     });

//     afterEach(function (done){
//         User.forceDelete(userID)
//         .then(function(){
//         done();
//         });
//     })

//     // Tests several functions at once
//     // TODO: Figure out how to separate and test in unit tests
//     it('should add, get and force delete a room', function () {
//         Room.add(userID, roomData)
//             .then(function(result){
//                 console.log(result);
//                 return Room.get(result.roomID);
//             }).then(function(result){
//                 console.log(result);
//                 result.should.be.an.Object();
//                 result.created_by.should.equal(userID);
//                 return result.id;
//             }).then(function(addedID){
//                 Room.forceDelete(addedID);
//                 return addedID;
//             }).then(function(addedID){
//                 return Room.get(addedID);
//             }).then(function(result){
//                 should.not.exist(result);
//             });
//     });
// });
