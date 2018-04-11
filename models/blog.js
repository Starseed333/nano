var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	tag: String,
	created: {
		type: Date,
		default: Date.now,
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String,
		email: String,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;