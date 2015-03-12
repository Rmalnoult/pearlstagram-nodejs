var insta = require('./instagram');
var users = require('./users');
var mongoose = require( 'mongoose' ),  
    User = mongoose.model('User'); 

module.exports = function (io) {

	// connection d'un nouvel utilisateur, le parametre
	// socket represente la connection de CET utilisateur
	io.sockets.on('connection', function (socket) {

		socket.on('auth', function  (userId) {
			console.log('set socket for userId = ' + userId);
			users.setSocket(userId, socket);
		});

		socket.on('newPhotoSearchByTag', function (data) {
			var userId = data.userId;
			var tag = data.tag;

			// var photos = insta.getPhotos(tag, userId);

			// add tag to user's suscriptions
			users.suscribe(tag, userId);

			insta.suscribeToTag(tag);

			var photos = 'photos';
			var usersArray = users.getUsersArray();
			usersArray[userId].socket.emit('displayPhotos', photos, tag);
			
		});



	});


}