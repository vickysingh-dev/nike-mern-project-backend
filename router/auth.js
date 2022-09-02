const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../model/userSchema");

router.get("/", (req, res) => {
    console.log("Hello World");
    res.json({ message: "All Working Fine!" });
})

// sign up route

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
    }
    catch {
        err => console.log(err);
    }
})


// sign in route

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Credentials Incomplete!" });
    }

    try {
        const userLogin = await User.findOne({ email: email });

        if (!userLogin) {
            return res.status(422).json({ error: "User Not Found!" });
        }

        if (await bcrypt.compare(password, userLogin.password)) {
            return res.json({ message: "User Sign In Successful!" });
        }
        else {
            return res.status(422).json({ error : "Password Incorrect"});
        }
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;