console.log('inside reg.js');
var express = require("express");
	router = express.Router({
		mergeParams: true
	}),
var flash = require("connect-flash");
var validator = require("email-validator");
var empty = require("is-empty");
var blog = require("../models/blog"),
var comment = require("../models/comment");
var middleware = require("../middleware");
var work = require("../models/work");
var nodemailer = require("nodemailer");

/*
BLOG - 
*/
router.get("/salon", function(req, res) {
	blog.find(
		{
			tag: "salon"
		},
		function(err, foundBlogPosts) {
			if (err) {
				//could not get makeup psots
				console.log(err)
				res.redirect("/blog")
			} else {
				//able to find makeup posts
				res.render("blog/tags", {
					blogPosts: foundBlogPosts
				})
			}
		}
	)
})

router.get("/styles", function(req, res) {
	blog.find(
		{
			tag: "styles"
		},
		function(err, foundBlogPosts) {
			if (err) {
				//could not get makeup psots
				console.log(err)
				res.redirect("/blog")
			} else {
				//able to find makeup posts
				res.render("blog/tags", {
					blogPosts: foundBlogPosts
				})
			}
		}
	)
})
router.get("/about", function(req, res) {
	blog.find(
		{
			tag: "about"
		},
		function(err, foundBlogPosts) {
			if (err) {
				//could not get makeup psots
				console.log(err)
				res.redirect("/blog")
			} else {
				//able to find makeup posts
				res.render("blog/about", {
					blogPosts: foundBlogPosts
				})
			}
		}
	)
})

/*
NODEMAILER CONFIGURATION
*/
router.get("/contact", function(req, res) {
	res.render("contact")
})
router.post("/contact", function(req, res) {
	/* NODEMAILER CONFIGURATION*/
	let transporter = nodemailer.createTransport({
		service: "gmail",
		secure: false,
		port: 25,
		auth: {
			user: process.env.nodeMailer_EMAIL,
			pass: process.env.nodeMailer_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	})
	var FullName = req.body.Fname + "  " + req.body.Lname
	var sender = req.body.name,
		subject = "Subject " + req.body.subject + " - " + FullName,
		info =
			"Name: \n\n" +
			FullName +
			"\n\nEmail Address: " +
			req.body.email +
			"\n\n Phone Number: \n\n" +
			req.body.phone +
			"\n\n Message:\n\n " +
			req.body.message
	console.log(sender)
	//Content of mailn
	let HelperOptions = {
		from: sender,
		to: process.env.owner_EMAIL,
		subject: req.body.subject,
		text: info
	}
	transporter.sendMail(HelperOptions, (error, info) => {
		if (error) {
			console.log(error) //display error
			req.flash("Error", "There was an error!")
			res.redirect("/contact")
		}
		console.log("The message was sent!") //prompt success
		console.log(info) //show info in console of email
		req.flash("success", "Email successfully sent!")
		res.redirect("/contact")
	})
})
module.exports = router
