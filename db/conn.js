const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect(DB)
    .then(() => {
        console.log('Connected to DataBase');
    })
    .catch((err) => {
        console.log(err);
    })