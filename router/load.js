const express = require("express");
const router = express.Router();

const { Product } = require("../model/productSchema");

// route to fetch data according to the category and for a given _id
router.post("/load", async (req, res) => {
    const { category, _id } = req.body;

    try {
        if (_id) {
            const items = await Product.findOne({ _id });
            return res.status(200).json(items);
        } else if (category) {
            const items = await Product.find({ category });
            return res.status(200).json(items);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
