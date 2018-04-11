var mongoose = require("mongoose");

var workSchema = new mongoose.Schema({
	title: String,
	image: String,
	text: String,

	created: {
		type: Date,
		default: Date.now
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	}
});

var Work = mongoose.model("Work", workSchema);

module.exports = Work