var instagram = require('./instagram');
var users = require('./users');
module.exports = function (io) {

	// connection d'un nouvel utilisateur, le parametre
	// socket represente la connection de CET utilisateur
	io.sockets.on('connection', function (socket) {

		socket.on('auth', function  (userId) {
			console.log('userId = ' + userId);
			users.setSocket(userId, socket);
		});
		socket.on('newSearch', function (data) {
			var userId = data.userId;
			var tag = data.tag;

			var photos = insta.getPhotos(tag, userId);
		});



	});


}