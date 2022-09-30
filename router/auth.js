const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const mongoose = require("mongoose");

const User = require("../model/userSchema");
const { Product } = require("../model/productSchema");
const userAuthenticate = require("../middleware/userAuth");

router.get("/", (req, res) => {
	console.log("Hello World");
	res.json({ message: "All Working Fine!" });
});

// router to sign up a new user.

router.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(422).json({ error: "Incomplete Credentials" });
	}

	try {
		const userExist = await User.findOne({ email: email });

		if (userExist) {
			return res.status(422).json({ error: "User Already Exists" });
		}

		const user = new User({ name, email, password });
		await user.save();
		console.log("User Saved");

		res.status(200).json({ messaage: "User Registered Successfully" });
	} catch {
		(err) => console.log(err);
	}
});

// router to sign in the user.

router.post("/signin", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(422).json({ error: "Credentials Incomplete!" });
	}

	try {
		let token;

		const userLogin = await User.findOne({ email: email });

		if (!userLogin) {
			return res.status(422).json({ error: "User Not Found!" });
		}

		if (await bcrypt.compare(password, userLogin.password)) {
			token = await userLogin.generateAuthToken();

			res.cookie("jwtoken", token, {
				expires: new Date(Date.now() + 86400000),
				httpOnly: true,
			});

			return res.status(200).json({ message: "User Sign In Successful!" });
		} else {
			return res.status(422).json({ error: "Password Incorrect" });
		}
	} catch (err) {
		console.log(err);
	}
});

// router to check if the user is authenticated to visit the cart page.
router.get("/cart", userAuthenticate, async (req, res) => {
	if (req.flag == true) {
		let cartItems = {};
		req.rootUser.cart.forEach((item) => {
			cartItems[item._id] = item;
		});
		let items = await Product.find({
			_id: Object.keys(cartItems),
		});
		items = items.map((item) => {
			item = item.toJSON();
			let response = { ...item, ...cartItems[item._id] };
			return response;
		});
		res.status(200).send({
			items,
		});
	} else {
		res.status(400).send({
			msg: "User not Authorized",
		});
	}
});

module.exports = router;
