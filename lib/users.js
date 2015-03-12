var mongoose = require( 'mongoose' ),  
    User = mongoose.model('User'); 
var usersArray = [];
var users = {
	// creation d'un user et de son id et de sa socket.
	addUser : function () {
		// display all users
		// User.find({}, function(err, users) {
		// 	console.log('new user');
		// 	console.log(users);
		// });

		// User.find({}, null, {sort: {dateAdded: 'desc' }}, function (err, previousUsers) {

		// 	if (previousUsers[0].userId) {
		// 		var id = previousUsers[0].userId;
		// 		id++;
		// 		var user = new User({userId : id});
		// 	} else {
		// 		var user = new User({userId : 1});
		// 	};
		// 	user.save();
		// 	console.log(user);
		// });
		var user = new User();
		user.save();

		usersArray[user.userId] = {
			socket: null
		};

		return user.userId;
	},

	getUsersArray: function (){
		return usersArray;
	},
	// stock le socket dans le tableau userarray ci dessus
	setSocket : function (userId, socket) {
		console.log('usersArray'+usersArray)
		usersArray[userId].socket = socket;
	},
	suscribe: function (tag, userId) {

		// if (tag exists) {
		// 	get tag
		// } else {
		// 	create tag
		// };
		// get user,
		// add tag to users suscription

		var usersArray = users.getUsersArray();
		usersArray[userId].tag = tag;
	},
	getUsersWhoSuscribed: function  (tag) {
		// return users who suscribed to this tag
		// get tag
		// get users who suscribed

	}
}

module.exports = users;