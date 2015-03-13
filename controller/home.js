var users = require('../lib/users');
var socket = require('../lib/socket');
var url = require('url');
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
	instagramSuscriptionHandshake: function (req, response) {
		console.log('got a response from instagram !!');
		parsedRequest = url.parse(req.url, true);
		console.log('<hubbbbbbbbbbbbbcHALLENGE></hubbbbbbbbbbbbbcHALLENGE> '+parsedRequest['query']['hub.challenge']);
		
		if (parsedRequest['query']['hub.mode'] === 'subscribe' && (parsedRequest['query']['hub.challenge'] != null) && parsedRequest['query']['hub.challenge'].length > 0) {
		  body = parsedRequest['query']['hub.challenge'];
		  headers = {
		    'Content-Length': body.length,
		    'Content-Type': 'text/plain'
		  };
		    response.writeHead(200, headers);
		    response.write(body);
		  return response.end();

		console.log('hubbbbbbbbbbbbb '+parsedRequest['query']['hub.challenge']);
		};
	}
};

module.exports = home;