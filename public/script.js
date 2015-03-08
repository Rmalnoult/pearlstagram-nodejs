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
		socket.emit('newSearch', {
		  'tag': tag,
		  'userId' : userId
		});

		socket.on('displayTag', function (tag) {
			console.log('hi '+ tag);
		});
	});


})();