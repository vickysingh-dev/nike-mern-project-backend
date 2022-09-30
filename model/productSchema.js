const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    size: {
        type: [String],
        default: ["XS", "S", "M", "L"],
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        default: "kids",
    },
});

const Product = mongoose.model("PRODUCT", productSchema);

module.exports = { Product };
