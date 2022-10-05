const express = require("express");
const router = express.Router();

const User = require("../model/userSchema");
const { Product } = require("../model/productSchema");

const userAuthenticate = require("../middleware/userAuth");
const sendEmail = require("../middleware/sendEmail");

router.post("/addItem", userAuthenticate, async (req, res) => {
    if (req.flag == true) {
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
    } else {
        return res.status(402).send({ msg: "User not signed In" });
    }
});

router.post("/updateItem", userAuthenticate, async (req, res) => {
    if (req.flag == true) {
        const query = req.body;
        const user_id = req.rootUser._id;
        if (Object.keys(query).length == 0) {
            return res.status(201).send({ msg: "No query sent" });
        } else {
            try {
                const item = await User.findOne({ _id: user_id });
                const result = await item.updateCart(
                    query.item_id,
                    query.quantity
                );
                return res.status(200).send(result);
            } catch (err) {
                console.log(err);
                return res.status(500).send({ msg: "Internal Server Error" });
            }
        }
    } else if (req.flag == false) {
        return res.status(400).send({ msg: "User Not Authorized" });
    }
});

router.get("/checkout", userAuthenticate, async (req, res) => {
    if (req.flag == true) {
        const user_id = req.rootUser._id;
        const user_email = req.rootUser.email;

        const user = await User.findOne({ _id: user_id });

        const result = await user.checkout();

        const newUser = {
            email: user_email,
            subject: "Thanks For Choosing Nike.",
            text: `Your Item has been successfully sent to dispatch. Generally, the goods take 2 to 3 working days
            to reach to your doorstep. It's our prime concern, that the product reaches out to you, in the best condition.
            If any fault with product, feel free to contact our customer care.
            Regards,
            Team Nike`,
        };

        const emailValid = await sendEmail(newUser);

        if (emailValid) {
            return res.status(200).send({ msg: "All is Well" });
        } else {
            return res
                .status(404)
                .send({ msg: "Cannot send the item, user not identified" });
        }
    } else {
        return res.status(400).send({ msg: "User Not Authorized" });
    }
});

// router.post("/getItems", async (req, res) => {
//     const query = req.body;
//     console.log("the query is ", query);
//     if (query.length == 0) {
//         return res.status(201).send({ msg: "Your Cart Is Empty" });
//     } else {
//         try {
//             const items = await Promise.all(
//                 query.map(async (ele) => {
//                     const item = await Product.findOne({ _id: ele._id });
//                     return item;
//                 })
//             );
//             console.log("Console log of getItems ", items);
//             res.status(200).send(items);
//         } catch (err) {
//             console.log(err);
//             res.status(500).send({ msg: "Internal Server Error" });
//         }
//     }
// });

module.exports = router;
