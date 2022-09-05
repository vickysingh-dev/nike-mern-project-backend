const express = require("express");
const router = express.Router();

const Comment = require("../model/commentSchema");

router.post("/comment", async (req, res) => {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment){
        return res.status(402).json({
            error: "Incomplete Data Send"
        })
    }
    try {
        const comm = new Comment({
            name, email, comment
        })
        await comm.save();

        console.log("Comment Saved");

        res.status(200).json({
            message: "Comment Uploaded!"
        })
    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router;