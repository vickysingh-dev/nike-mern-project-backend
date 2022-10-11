const express = require("express");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const router = express.Router();
// const mongoose = require("mongoose");

const User = require("../model/userSchema");
const { Product } = require("../model/productSchema");
const userAuthenticate = require("../middleware/userAuth");

const sendEmail = require("../middleware/sendEmail");

// router to sign up a new user.

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({ error: "Incomplete Credentials" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(409).json({ error: "User Already Exists" });
        }

        const newUser = {
            email: email,
            subject: "Welcome To the World of Nike",
            text: `Hope our products and daily equipments, help you to unleash the ATHLETE* within you. 
            We champion continual progress for athletes and sport by taking action to help athletes reach their potential. 
            Every job at NIKE, Inc. is grounded in a team-first mindset, cultivating a culture of innovation and a shared purpose to leave an enduring impact.
            
            Regards,
            Team Nike`,
        };

        const emailValid = await sendEmail(newUser);

        if (emailValid) {
            const user = new User({ name, email, password });
            await user.save();

            return res
                .status(200)
                .json({ messaage: "User Registered Successfully" });
        } else {
            return res.status(404).send({ msg: "Email Not Valid" });
        }
    } catch {
        (err) => console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

// router to sign in the user.

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        let token;

        const userLogin = await User.findOne({ email: email });

        if (!userLogin) {
            return res.status(401).json({ error: "User Not Found!" });
        }

        if (await bcrypt.compare(password, userLogin.password)) {
            token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true,
            });

            return res
                .status(200)
                .json({ message: "User Sign In Successful!" });
        } else {
            return res.status(401).json({ error: "Password Incorrect" });
        }
    } catch (err) {
        console.log(err);
    }
});

// router to sign out the user
router.get("/signout", (req, res) => {
    res.clearCookie("jwtoken");
    res.status(200).send({ cookieCleared: true });
});

// router to check if the user is authenticated to visit the cart page.
router.get("/cart", userAuthenticate, async (req, res) => {
    if (req.flag == true) {
        let cartItems = {};
        req.rootUser.cart.forEach((item) => {
            cartItems[item._id] = item;
        });
        let _items = await Product.find({
            _id: Object.keys(cartItems),
        });
        // _items = _items.map((item) => {
        //     item = item.toJSON();
        //     let response = { ...item, ...cartItems[item._id] };
        //     return response;
        // });
        let items = req.rootUser.cart.map((item) => {
            let response;
            _items.forEach((element) => {
                element = element.toJSON();
                if (item._id == element._id) {
                    response = { ...element, ...item };
                }
            });
            return response;
        });
        res.status(200).send({
            items,
            userName: req.rootUser.name,
        });
    } else {
        res.status(400).send({
            msg: "User not Authorized",
        });
    }
});

module.exports = router;
