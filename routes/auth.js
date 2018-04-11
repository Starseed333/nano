//dependencies
var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	empty = require("is-empty"),
	User = require("../models/user"),
	Work = require("../models/work"),
	blog = require("../models/blog"),
	validator = require("email-validator"),
	middleware = require("../middleware")

/*
Authentication routes
*/
//ROOT ROUTE
router.get("/", function(req, res) {
	//registerOwner()
	//Second thing, Register Developer

	//Now run code to render idnex page
	blog.find({}, function(err, BlogPosts) {
		if (err) {
			res.send("Error connencting to database");
			console.log(err)
		} else {
			//now search for WorkPosts
			Work.find({}, function(err, workPosts) {
				if (err) {
					res.send("Error connecting to database!");
					console.log(err)
				} else {
					//slice posts recent 6
					BlogPosts = BlogPosts.slice(BlogPosts.length - 6, BlogPosts.length)
					workPosts = workPosts.slice(workPosts.length - 8, workPosts.length)
					res.render("index", {
						Posts: BlogPosts,
						Works: workPosts
					}) //
				}
			}) //end work.find()
		} //end else blog.find()
	}) //end blog.find
}) //end route
/*
render register form, make sure to check if email is real,
add some credentiakls requrirements
*/
router.get("/register", function(req, res) {
	res.render("register")
})

/*
Sign user up
check if Email is valid first,
then check if email is in database already
*/
router.post("/register", function(req, res) {
	//First things first, check if email is a real email
	if (!validator.validate(req.body.email)) {
		//Email not real, redirect back with error
		console.log("ERROR SIGNING UP")
		req.flash("error", "ERROR: Check if Email is valid")
		return res.redirect("/register")
	} else {
		//Email is real, not fake, move on.
		console.log("Succes, Email is validated-real")
		//Now check in database if there is a user with that email already
		console.log("Now checking database if email exists already")

		User.find({}, function(err, foundUsers) {
			if (err) {
				//Error, something wrong with this code segment
				console.log(err)
			} else {
				//No error
				//Search for user
				if (foundUsers) {
					//Now have all users, see if any of the foundUsers have this email
					console.log("displaying users in database")

					var found = false,
						desiredEmail = req.body.email
					var y = 0
					console.log("Displaying desired email: " + desiredEmail)

					while (y < foundUsers.length && !found) {
						if (foundUsers[y].email == desiredEmail) {
							console.log("EMAIL WAS FOUND IN THE DATABASE ALREADY")
							found = true //found it, change boolean value to break out of loop
						}

						y++ //increment y, check next user
					}

					console.log(foundUsers)

					if (found) {
						console.log("Email found and redirecting to failure")
						req.flash("error", "Error, email already in database!")
						return res.redirect("/register")
					}

					//Else if the email is validated and there is no user with that, we can regsiter this user
					console.log("no problems found, registering new user")

					var newUser = new User({
						username: req.body.username,
						email: desiredEmail
					})
					//Register a new User,
					User.register(newUser, req.body.password, function(err, user) {
						if (err) {
							//problem, registering user, with password/username already in use
							req.flash("error", err.message)
							console.log(err)
							return res.redirect("/register")
						} else {
							//No problem registering user, success

							console.log("setting email" + desiredEmail)
							user.email = desiredEmail
							console.log(user.email)
							passport.authenticate("local")(req, res, function() {
								console.log("successfully registered a new user")
								req.flash("success", "Welcome, " + user.username)

								res.redirect("/")
							}) // end of passport.authenticate
						} //end else
					}) //end user.register
				} //end else
			}
		})
	} //End user.find()
})
//End /post register route

router.get("/login", function(req, res) {
	res.render("login")
})

//Log user in
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		badRequestMessage: "There was an error, please try again!",
		failureFlash: true
	}),
	function(req, res) {}
)

//LOGOUT ROUTES

router.get("/logout", function(req, res) {
	req.logout()
	req.flash("error", "Successfully Logged out!")
	res.redirect("/campgrounds")
})
module.exports = router
