var users = require('../lib/users');
var socket = require('../lib/socket');
var home = {
	getIndex: function (req, res) {
		var userId;
		if (req.session.userId) {
			userId = req.session.userId;
		} else {
			userId = req.session.userId = users.addUser();
		}
		console.log(req.session);
		

		console.log('added new user id : '+userId);

		// render la page home (index.html)
		res.render('home/index', {
			userId: userId,
		})
	},
	displayNewPic: function (req, res) {
		console.log(req);

		// get photo(s) from request
		// get tag from request

		// get ids of users who suscribe to this pic
		var usersWhoSuscribed = [];
		usersWhoSuscribed = users.getUsersWhoSuscribed(tag);
		// send it via socket to users
		for (var i = 0; i < usersWhoSuscribed.length; i++) {
			usersArray[usersWhoSuscribed[i]].socket.emit('displayNewInstagramPhoto', photo);
		};
		

	},
	getInstagramToken: function (req, res) {
		console.log('got a response from instagram !!');
		console.log(req);
	}
};

module.exports = home;