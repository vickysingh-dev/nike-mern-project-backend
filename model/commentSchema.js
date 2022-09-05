const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    comment: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: () => {
            return new Date;
        }
    }
})

const comment = mongoose.model("COMMENT", commentSchema);

module.exports = comment;