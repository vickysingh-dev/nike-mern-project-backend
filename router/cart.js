const express = require("express");
const router = express.Router();

const User = require("../model/userSchema");
const { Product } = require("../model/productSchema");

const userAuthenticate = require("../middleware/userAuth");

router.post("/addItem", userAuthenticate, async (req, res) => {
    const { item_id, size } = req.body;
    const user_id = req.rootUser._id;

    if (!item_id || !size) {
        return res.status(400).send({
            msg: "Incomplete information in the Request",
        });
    }

    try {
        const user = await User.findOne({ _id: user_id });
        const result = await user.addToCart(item_id, size);
        console.log("The result is ", result);
        if (result.save) {
            return res.status(200).send(user);
        }
        return res.status(201).send({ msg: "Item Already in cart" });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: "Can't add the item to cart",
        });
    }
});

router.post("/getItems", async (req, res) => {
    const query = req.body;
    console.log("the query is ", query);
    if (query.length == 0) {
        return res.status(201).send({ msg: "Your Cart Is Empty" });
    } else {
        try {
            const items = await Promise.all(
                query.map(async (ele) => {
                    const item = await Product.findOne({ _id: ele._id });
                    // const obj1 = { item_size: ele.size };
                    // const obj2 = { item_quantity: ele.item_quantity };
                    // const newObj = Object.assign(item, obj1, obj2);
                    // console.log(newObj);
                    // console.log(typeof item);
                    // item["size"] = ele.size;
                    // item["size"].push(ele.quantity);
                    // item["item_size"] = ele.size;
                    // item["item_quantity"] = ele.quantity;
                    return item;
                })
            );
            console.log("Console log of getItems ", items);
            res.status(200).send(items);
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "Internal Server Error" });
        }
    }
});

module.exports = router;
