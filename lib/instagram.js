var users = require('../lib/users');
var igCreds = require('../config/instagramCredentials');
var request = require('request');
var ig = require('instagram-node').instagram();
var Instagram = require('instagram-node-lib');
var socket = require('../lib/socket');

// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 

// instagram.use({ access_token: 'YOUR_ACCESS_TOKEN' });

ig.use({ client_id: '22df4a70d6334519b74130b379a7a19a',
         client_secret: '6564a763c1b04037885a212d22104846' });

Instagram.set('client_id', igCreds.clientId);
Instagram.set('client_secret', igCreds.client_secret);
Instagram.set('callback_url', igCreds.callbackURL);
Instagram.set('redirect_uri', igCreds.callbackURL);
Instagram.set('maxSockets', 10);


var insta = {
	getPhotos: function (tag) {
	// get similar tags
		// ig.tag_search(tag, function(err, result, remaining, limit) {
		// });
		
	// get recent media
		// ig.media_popular(function(err, medias, remaining, limit) {});

		ig.tag_media_recent(tag, function(err, medias, remaining, limit) {
			// console.log('medias : '+medias[0].images.thumbnail.url);

			// for (var i = medias.length - 1; i >= 0; i--) {
			// 	if (i == 1) {
			// 		console.log(medias[i]);
			// 	};
			// };


			return medias;
		});

		
	},
	getNewPic : function (tag, callback) {
		console.log('getting pics for '+tag);
		ig.tag_media_recent(tag, function(err, medias, remaining, limit) {
			console.log('medias : '+ medias[0].images.thumbnail.url);

			// for (var i = medias.length - 1; i >= 0; i--) {
			// 	if (i == 1) {
			// 		console.log(medias[i]);
			// 	};
			// };

			var url = medias[0].images.thumbnail.url;
			var photo = medias[0];
			callback(photo);
		});
	},
	suscribeToTag: function (tag) {
		Instagram.subscriptions.subscribe({
		  client_id: igCreds.clientId,
		  client_secret : igCreds.client_secret,
		  object: 'tag',
		  object_id: tag,
		  aspect: 'media',
		  callback_url: igCreds.callbackURL,
		  type: 'subscription',
		  id: '#'
		});



		// request.post(
		//     'https://api.instagram.com/v1/subscriptions/',
		//     { form: { 
		//     	client_id: igCreds.clientId,
		//     	client_secret : igCreds.client_secret,
		//     	object : 'tag',
		//     	object_id : tag,
		//     	aspect : 'media',
		//     	verify_token : igCreds.token,
		//     	callback_url : igCreds.callbackURL
		//     	 } },
		//     function (error, response, body) {
		//     	console.log('sent post request');
		//     	console.log('error'+error);
		//     	// console.log('response'+response);
		//     	// console.log('body'+body);
		//         if (!error && response.statusCode == 200) {
		//         	console.log('RESPONSE');
		//         	// console.log(response);
		//         }
		//     }
		// );



	}





};

module.exports = insta;