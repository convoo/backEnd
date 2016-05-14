// 'use strict';

// require('dotenv').config();
// var should = require('should');
// var Token = require('../../helpers/token');
// var User = require('../../models/user');
// var Room = require('../../models/room');
// var sockets = require('socket.io-client');
// var socketsUrl = ('http://localhost:'+process.env.WEB_PORT);
// var options = {
//     transports: ['websocket'],
//     'force new connection': true,
//     reconnect: true
// };

// describe('Room Sockets', function () {
//     var server, testUser, userID, userJWT, testRoom, testRoomID, testRoomSlug;

//     before(function(done){
//         delete require.cache[require.resolve('../../server.js')];
//         server = require('../../server.js').server;
//         var userType = 'Guest';
//         userID = Token.makeID();
//         console.log(userID);
//         userJWT = Token.makeJWT(userID, userType, '/');
//         var socketID = Token.makeID();
//         testUser = User.add(userType, userID, socketID)
//             .then(function(){
//                 Room.add(userID, {
//                     title: "Hello",
//                     canJoin: true,
//                     sharedUrl: "https://convoo.me"
//                 }).then(function(result){
//                     console.log(result);
//                     testRoomID = result.roomID;
//                     testRoomSlug = result.slug;
//                 }).then(function(){
//                     done();
//                 });
//             });
//     });

//     after(function(done){
//         User.forceDelete(userID).then(function(){
//             server.close();
//             done();
//         });
//     });



//     it("should get an error when getting a room that doesn't exist", function (done) {
//         var client = sockets.connect(socketsUrl, options);
//         client.emit('getRoom', {roomID: "123asfoi212312"});
//         client.on('getRoom', function(data){
//             should.exist(data);
//             data.should.have.property('error').which.is.a.String();
//             done();
//         });
//     });


//     it('should add a room', function (done) {
//         var client = sockets.connect(socketsUrl, options);
//         client.emit('addRoom', {
//             jwt: userJWT,
//             roomData: {
//                 title: "Hello",
//                 canJoin: true,
//                 sharedUrl: "https://convoo.me"
//             }
//         });
//         client.on('addRoom', function(addRoomData){
//             should.exist(addRoomData)
//             should(addRoomData).be.ok();
//             addRoomData.should.have.property('result');
//             addRoomData.result.should.have.property('roomID');
//             Room.forceDelete(addRoomData.result.roomID).then(function(){
//                 done();
//             });
//         });
//     });


//     // describe('Get and delete existing room', function () {
//     //     beforeEach(function(done){

//     //     });


//         it('should get a room by id', function (done) {
//             var client = sockets.connect(socketsUrl, options);

//             client.emit('getRoom', {roomID: testRoomID});
//             client.on('getRoom', function(getRoomData){
//                 should.exist(getRoomData);
//                 should(getRoomData).be.ok();
//                 getRoomData.should.not.have.property('error');
//                 getRoomData.should.have.property('result');
//                 getRoomData.result.should.have.property('slug').which.is.a.String();
//                 done();
//             });
//         });

//         it('should get a room by slug', function (done) {
//             var client = sockets.connect(socketsUrl, options);
//             client.emit('getRoomBySlug', {slug: testRoomSlug});
//             client.on('getRoomBySlug', function(getRoomData){
//                 should.exist(getRoomData);
//                 should(getRoomData).be.ok();
//                 getRoomData.should.not.have.property('error');
//                 getRoomData.should.have.property('result');
//                 getRoomData.result.should.have.property('slug').which.is.a.String();
//                 done();
//             });
//         });

//     // });



//     // it('should add, get and delete a room', function (done) {
//     //     var client = sockets.connect(socketsUrl, options);

//     //     client.emit('addRoom', {
//     //         jwt: userJWT,
//     //         roomData: {
//     //             title: "Hello",
//     //             canJoin: true,
//     //             sharedUrl: "https://convoo.me"
//     //         }
//     //     });
//     //     client.on('addRoom', function(addRoomData){
//     //         should.exist(addRoomData)
//     //         should(addRoomData).be.ok();
//     //         addRoomData.should.have.property('result');
//     //         addRoomData.result.should.have.property('roomID');
//     //         client.emit('getRoom', {roomID: addRoomData.result.roomID});
//     //         client.on('getRoom', function(getRoomData){
//     //             should.exist(getRoomData);
//     //             should(getRoomData).be.ok();
//     //             getRoomData.should.not.have.property('error');
//     //             getRoomData.should.have.property('result');
//     //             getRoomData.result.should.have.property('slug').which.is.a.String();
//     //             client.emit('getRoomBySlug', {roomSlug: getRoomData.result.slug});
//     //             client.on("getRoomBySlug", function(getRoomSlugData){
//     //                 should.exist(getRoomSlugData);
//     //                 should(getRoomSlugData).be.ok();
//     //                 getRoomSlugData.should.have.property('result');
//     //                 getRoomSlugData.result.should.have.property('id');
//     //                 client.emit('forceDeleteRoom', {roomID: getRoomSlugData.result.id});
//     //                 client.on('forceDeleteRoom', function(deleteData){
//     //                     deleteData.should.not.have.property('error');
//     //                     deleteData.should.have.property('result');
//     //                     done();
//     //                 });
//     //             });

//     //         });
//     //     })

//     // });

// });
