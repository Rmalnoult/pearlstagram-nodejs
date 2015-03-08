var users = require('../lib/users');
var socket = require('../lib/socket');
usersArray = users.getUsersArray();
var home = {
	getIndex: function (req, res) {
		var userId;
		if (req.session.userId) {
			userId = req.session.userId;
		} else {
			userId = req.session.userId = users.addUser();
		}
		console.log(req.session);
		// render la page home (index.html)
		res.render('home/index', {
			userId: userId,
		})
	},
};

module.exports = home;