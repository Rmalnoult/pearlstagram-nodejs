// Bring Mongoose into the app 
var mongoose = require( 'mongoose' ); 
var userSchema = mongoose.Schema({
	userId: { type: Number, default: Math.floor((Math.random() * 1000000000000000) + 1) },
	name : String,
	socket : Object,
	tags : Array,
	dateAdded : { type: Date, default: Date.now }
});

exports.User = mongoose.model('User', userSchema);