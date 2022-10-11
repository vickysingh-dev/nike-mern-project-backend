const express = require("express");

const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("./../model/userSchema");

const sendEmail = require("./../middleware/sendEmail");

// router to generate otp and send it to email
router.post("/getOtp", async (req, res) => {
    const data = req.body;

    const OTP = Math.floor(1000 + Math.random() * 9000);
    const userDetails = await User.findOne({ email: data.email });

    if (!userDetails) {
        return res.status(404).send({ msg: "User Not Registered" });
    } else {
        try {
            userDetails.otp = OTP;
            await userDetails.save();
        } catch (err) {
            return res.status(500).send({ msg: "Internal Server Error" });
        }
        const newUser = {
            email: data.email,
            subject: "Your request for OTP to Change Password",
            text: `As per your Request to change password, your OTP is :

                ${OTP}

            Do not share your OTP with anyone.
            If you are not the one who initiated this request click the link below :

                http://localhost:8000/userHacked

            Thank you, Enjoy Shopping.

            Regards,
            Team Nike`,
        };

        const emailValid = await sendEmail(newUser);

        if (emailValid) {
            return res.status(200).json({ messaage: "OTP Send Successfully" });
        } else {
            return res.status(404).send({ msg: "Error Sending Email" });
        }
    }
});

// route to confirm otp

router.post("/confirmOtp", async (req, res) => {
    const data = req.body;

    try {
        const userDetails = await User.findOne({ email: data.email });
        if (!userDetails) {
            return res.status(404).send({ msg: "Front End Error!" });
        }
        if (userDetails.otp == data.otp) {
            return res.status(200).send({ msg: "user validated with the otp" });
        } else {
            return res.status(400).send({ msg: "Invalid Otp Provided!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "internal server error" });
    }
});

// route to reset password

router.post("/updatePass", async (req, res) => {
    const data = req.body;

    if (!data.password) {
        return res.status(400).send({ msg: "Password should not be Empty" });
    }
    try {
        const userDetails = await User.findOne({ email: data.email });
        if (userDetails.otp == data.otp) {
            if (await bcrypt.compare(data.password, userDetails.password)) {
                return res.status(201).send({
                    msg: "New Password Cannot be same as the old password!",
                });
            }
            userDetails.password = data.password;
            userDetails.otp = null;
            await userDetails.save();
            return res
                .status(200)
                .send({ msg: "Password Updated Successfully" });
        } else {
            return res.status(400).send({ msg: "FrontEnd Error!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = router;
