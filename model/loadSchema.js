const mongoose = require("mongoose");

const loadSchema = new mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    address: {
        title: String
    }
})

const men = mongoose.model('MEN', loadSchema);

module.exports = men;