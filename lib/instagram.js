var users = require('../lib/users');
var instagram = require('instagram-node').instagram();
var socket = require('../lib/socket');
usersArray = users.getUsersArray();

// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
instagram.use({ access_token: 'YOUR_ACCESS_TOKEN' });
instagram.use({ client_id: 'YOUR_CLIENT_ID',
         client_secret: 'YOUR_CLIENT_SECRET' });

var insta = {
	getPhotos: function (tag, userId) {
		usersArray[userId].socket.emit('displayTag', tag);
	}
};

module.exports = insta;