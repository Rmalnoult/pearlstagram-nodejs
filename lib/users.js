var ids = 0;
var usersArray = [];
var users = {
	// creation d'un user et de son id et de sa socket.
	addUser : function (id) {
		var id = ++ids;
		usersArray[id] = {
			socket: null,
			tags: []
		};
		return id;
	},
	getUsersArray: function (){
		return usersArray;
	},

	// stock le socket dans le tableau userarray ci dessus
	setSocket : function (userId, socket) {
		usersArray[userId].socket = socket;
	},
	onNewSearch: function (tag, userId) {
		usersArray[userId].socket.emit('displayTag', tag);
		// var tags = users.addTag(req.session.userId, req.body.tag);
		// require('../lib/twitter');
		// var usersArray = users.getUsersArray();
		// usersArray[req.session.userId].socket.emit('storeTagInSession', tags);

		// res.send('hi');
	},
}

module.exports = users;