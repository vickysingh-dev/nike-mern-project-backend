const express = require("express");
const router = express.Router();

const { Product } = require("../model/productSchema");

const userAuthenticate = require("../middleware/userAuth");

// route to fetch data according to the category and for a given _id
router.post("/load", async (req, res) => {
    const { category, _id } = req.body;

    try {
        if (_id) {
            const items = await Product.findOne({ _id });
            console.log(items);
            return res.status(200).json(items);
        } else if (category) {
            const items = await Product.find({ category });
            return res.status(200).json(items);
        }
    } catch (err) {
        console.log(err);
    }
});

// route used to upload items to the database
// router.post("/productUpload", async (req, res) => {
//     const { name, price, image } = req.body;
//     if (!name || !price || !image) {
//         return res.status(400).send({ error: "Incomplete Credential" });
//     }
//     try {
//         const product = new Product({ name, price, image });
//         await product.save();
//         console.log("Product Uploaded");
//         res.status(200).json({ msg: "Product Saved Successfully" });
//     } catch (err) {
//         console.log(err);
//     }
// });

module.exports = router;
