var blog = require("../models/blog");
var Comment = require("../models/comment");
var middlewareObj = {};

/*
Only available to Owner and developer
Checks if the user is the Author of the blogPost, so
-Conditions for Nancy and I must be met in this function
*/
middlewareObj.isAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		//Check if user is the owner of the blogPost, find the post by ID first
		blog.findById(req.params.id, function(err, foundBlog) {
			if (err) {
				console.log(err)
				req.flash("error", "Blog not found!")
				res.redirect("back")
			} else {
				//check if user owns blog
				if (foundBlog.author.id.equals(req.user._id)) {
					next() //move to next action
				} else {
					console.log("User does not own this blog")
					req.flash("Error", "You don't have permission to do that!")
					res.redirect("back")
				}
			}
		})
	} else {
		console.log("User is not logged in")
		req.flash("error", "You need to be logged in!")
		res.redirect("/login")
	}
}
/*
isOWNER function
This will check if the user is either Owner or Dev
*/
middlewareObj.isOwnerOrDeveloper = function(req, res, next) {
	if (req.isAuthenticated()) {
		//Check if user is logged in, if so, now we check
		//req.user.username == process.env.owner_USERNAME ||
		if (
			req.user.email == process.env.sandra_EMAIL ||
			req.user.email == process.env.owner_EMAIL
		) {
			//if Username matches, environment email, defined by developer, move on
			req.flash(
				"success",
				"You have authorization to be here, please continue " +
					req.user.username
			)
			next() //Allow Developer/owner to proceed
		} else {
			//usernamme does not match, handle by redirecting
			console.log(
				"Error, this user is not the owner or developer, redirecting..."
			)
			req.flash("Error", "You do not have the permissions to access this page!")
			res.redirect("back")
		}
	} else {
		//User is not logged in to begin with, this should be handled combined with isLoggedIn, but we check anyways
		console.log("User is not logged in to begin with!")
		req.flash("Error", "you need to be logged in!")
		res.redirect("/login")
	}
}

/*
Check if User isLOGGEDIN
Should be the basis for users creating comments to posts
//Also allows browser to check if owner is Nancy or dev
*/
middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		req.flash("error", "You need to be logged in!!")
		res.redirect("/login")
	}
}

/*
Check if user is the Comment Author, if so, should display option to delete/edit a cmoment for the user
*/

middlewareObj.isCommentAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		//check if user is logged in
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back")
			} else {
				//does user own the comment
				if (foundComment.author.id.equals(req.user._id)) {
					next()
				} else {
					console.log("not the comment author, checking if owner or develoepr")
					//If the author is not the commentAuthor, check if owner or developer next, redirect back if failure
					if (
						req.user.username == process.env.sandra_USERNAME ||
						req.user.username == process.env.owner_USERNAME
					) {
						console.log(
							"Current user making a request is the Owner or Developer, proceeding..."
						)
						next()
					} else {
						//user does not own own comment
						console.log(
							"User is neither the author of the comment, nor the owner/developer, redirecting..."
						)
						res.redirect("back")
					}
				}
			}
		})
	} else {
		//user not logged in
		console.log("user is not logged in")
		req.flash("error", "You need to be logged in!")
		res.redirect("back")
	}
}

//return all middleware methods
module.exports = middlewareObj
