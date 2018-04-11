var mongoose = require("mongoose");
var	passportLocal = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
});
//include passport - local methods with user model
userSchema.plugin(passportLocal);

//return user model
module.exports = mongoose.model("User", userSchema);