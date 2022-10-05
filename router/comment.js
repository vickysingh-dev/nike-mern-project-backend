const express = require("express");
const sendEmail = require("../middleware/sendEmail");
const router = express.Router();

const Comment = require("../model/commentSchema");

router.post("/comment", async (req, res) => {
    const { name, email, comment } = req.body;

    const newUser = {
        email: email,
        subject: "Thank You, for sharing your concern.",
        text: `Your Comment 
        '${comment}'
        has been sent successfully. Our executives, are looking in the matter. We will notify you as soon,
        as we get a fix for you. Your patience is highly appreciated.
        Regards,
        Team Nike`,
    };

    const emailValid = sendEmail(newUser);

    if (emailValid) {
        try {
            const comm = new Comment({
                name,
                email,
                comment,
            });
            await comm.save();

            console.log("Comment Saved");

            res.status(200).json({
                message: "Comment Uploaded!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Internal Server Error" });
        }
    } else {
        return res.status(422).send({ msg: "Email Invalid" });
    }
});

module.exports = router;
