const express = require("express");
const router = express.Router();

const Men = require("../model/loadSchema");

router.post("/men", async (req, res) => {
    const { category } = req.body;
    if (!category){
        return res.status(422).json({
            error: "Incomplete Request"
        })
    }
    try {
        const men = await Men.find();
        return(res.status(200).json(men));
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;