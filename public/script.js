(function () {
	// créé une nouvelle connexion avec le serveur
	var socket = io();

	socket.emit('auth', userId);

	var tags = [];

	$('div.searchbox form').on('submit', function(event) {
		event.preventDefault();
		console.log('submit');
		var tag = $('#userinput').val();
		console.log('tag = '+tag);

		socket.emit('newPhotoSearchByTag', {
		  'tag': tag,
		  'userId' : userId
		});

		socket.on('displayPhotos', function (photos, tag) {
			console.log('displayPhotos for tag '+tag);
			// pearlstagram.displayPhotos(photos, tag);
		});

	});


})();