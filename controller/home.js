var users = require('../lib/users');
var socket = require('../lib/socket');
var insta = require('../lib/instagram');
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
	onNewPic: function (req, res) {

		console.log('new pic from instagram');
		var data = req.body;
		console.log(data);
		data.forEach(function(tag) {
		  // var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=479edbf0004c42758987cf0244afd3ef';
		  console.log(tag.object_id);
		  insta.getNewPic(tag.object_id, function(data) {
		  	console.log('callback');
		  	console.log('callback data : '+data);
		  });

		});
		res.end();




	},

	instagramSuscriptionHandshake: function (req, response) {
		console.log('Hello from Instagram');
		// console.log(req);
		console.log(req.body);
		parsedRequest = url.parse(req.url, true);
		// console.log('<hubbbbbbbbbbbbbcHALLENGE></hubbbbbbbbbbbbbcHALLENGE> '+parsedRequest['query']['hub.challenge']);
		
		if (parsedRequest['query']['hub.mode'] === 'subscribe' && (parsedRequest['query']['hub.challenge'] != null) && parsedRequest['query']['hub.challenge'].length > 0) {
		  body = parsedRequest['query']['hub.challenge'];
		  headers = {
		    'Content-Length': body.length,
		    'Content-Type': 'text/plain'
		  };
		    response.writeHead(200, headers);
		    response.write(body);
		    return response.end();
		};
	}
};

module.exports = home;