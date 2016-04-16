'use strict';

//----------------------------- ON EDIT PROFILE
  exports.editProfile = function (socket, msg) {

      var imageSent;
      if(msg.image60){
            imageSent = true;
      } else {
          imageSent = false;
      }

          var userID = f.token.readJWT(msg.jwt).user_id;
          f.aws.s3PutBase64(msg.image60, 'images/users/'+userID, '60');
          f.aws.s3PutBase64(msg.image300, 'images/users/'+userID, '300');
          f.user.edit(userID, msg.fullName, msg.email, msg.bio, msg.emailMe, msg.notifyMe, imageSent);
  };


//----------------------------- ON GET PROFILE
  exports.getProfile = function (socket, io, msg) {
          var userID = f.token.readJWT(msg).user_id;
          f.user.get(userID).then(function (profile) {
              console.log(profile);
                console.log(socket.id);
          io.to(socket.id).emit('resGetProfile', {profile: profile});
      });

  };

//----------------------------- ONLINE USERS STREAM
  exports.onlineUsers = function (socket, io) {
      socket.on('onlineUsers', function (msg) {
          f.user.onlineAll();
      });
  };
