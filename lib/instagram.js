var users = require('../lib/users');
var instagram = require('instagram-node-lib');
var socket = require('../lib/socket');
usersArray = users.getUsersArray();

var insta = {
	getPhotos: function (tag, userId) {
		usersArray[userId].socket.emit('displayTag', tag);
	}
};

module.exports = instagram;