var users = require('../lib/users');
var ig = require('instagram-node').instagram();
var socket = require('../lib/socket');

// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 

// instagram.use({ access_token: 'YOUR_ACCESS_TOKEN' });

ig.use({ client_id: '22df4a70d6334519b74130b379a7a19a',
         client_secret: '6564a763c1b04037885a212d22104846' });

var insta = {
	getPhotos: function (tag, userId) {
	// get similar tags
		// ig.tag_search(tag, function(err, result, remaining, limit) {
		// });
		
	// get recent media
		// ig.media_popular(function(err, medias, remaining, limit) {});

		ig.tag_media_recent(tag, function(err, medias, remaining, limit) {
			return medias;
		});

		
	}
};

module.exports = insta;