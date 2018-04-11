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


app.get("*", function(req, res) {
	//Default route, redirect to landing
	res.redirect("/");
})





var port = process.env.PORT || 3000
app.listen(port, function() {
	console.log("Server is listening " + port);
})