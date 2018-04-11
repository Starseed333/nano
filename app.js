//dependencies
const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const Upload = require("express-fileupload");
const LocalStrategy = require("passport-local");
const validator = require("email-validator");
const middleware = require("./middleware/index");
//Models
const blog = require("./models/blog");
const User = require("./models/user");
const Work = require("./models/work");
const comment = require("./models/comment");


//Express Router

const authRoutes = require("./routes/auth");



//Mongo Database
mongoose.connect(process.env.DB_URL || "mongodb://localhost/nano");

mongoose.connection
	.once("open", function() {
		//console succesful connection
		console.log("Successfully connected to database");
	})
	.on("error", function(error) {
		//console error
		console.log("Error connecting to MongoDB");
	})

app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/public"))
app.use(flash())
app.use(Upload())

app.set("view engine", "ejs")


app.use(
	require("express-session")({
		secret: "Nano Paws",
		resave: false,
		saveUninitialized: false
	})
)

/*
USER PASSPORT CONFIGURATION
*/
app.use(passport.initialize())
app.use(passport.session())
// passport.use(new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next()
})
/*
Post request to /work, in app.js to make use of express file-upload
*/
app.post("/work", middleware.isOwnerOrDeveloper, function(req, res) {
	console.log(req.files)
	if (req.files) {
		var file = req.files.filename,
			filename = file.name
			//customer images 
		uploadName = "public/uploads/" + filename
		file.mv(uploadName, function(err) {
			if (err) {
				//If error display error, and redirect to work
				console.log(err)
				req, flash("Error", "error uploading the image!")
				res.redirect("/work")
			} else {
				console.log("Successfully uploaded")
				//CREATE A NEW BLOG POST
				var workUploadImage = "/uploads/" + filename
				if (req.body.description.length > 45) {
					console.log("Work Post description too long, error!")
					req.flash("Error", "Description only 15 characters max")
					return res.redirect("back")
				}
				var newWorkPost = {
					title: req.body.name,
					text: req.body.description,
					image: workUploadImage
				}
				work.create(newWorkPost, function(err, newPost) {
					if (err) {
						req.flash("error", "Something went wrong making a post")
						return res.redirect("back")
						console.log("error trying to make new post")
					} else {
						console.log("Successfully made a nwe Work Post!")
						req.flash("success", "success making a work post!")
						res.redirect("/work")
					}
				})
			}
		})
	}
});

app.get("*", function(req, res) {
	//Default route, redirect to landing
	res.redirect("/");
});


var port = process.env.PORT || 3000
app.listen(port, function() {
	console.log("Server is listening " + port);
});