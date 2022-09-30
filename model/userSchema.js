const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: () => new Date(),
    },
    // tokens: [
    //     {
    //         token: {
    //             type: String,
    //             required: true,
    //         },
    //     },
    // ],
    cart: [
        {
            _id: {
                type: Object,
            },
            size: {
                type: String,
            },
            quantity: {
                type: Number,
            },
        },
    ],
});

// hashing password

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// generating json web token

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({ token: token });
        // await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
};

userSchema.methods.addToCart = async function (item_id, size) {
    try {
        let save;
        this.cart.forEach((element) => {
            if (element._id == item_id && element.size == size) {
                console.log("Item found in the cart");
                save = false;
            }
        });
        if (save == false) {
            return { save: false };
        }
        this.cart = this.cart.concat({ _id: item_id, size: size, quantity: 1 });
        await this.save();
        return { save: true };
    } catch (err) {
        console.log(err);
        console.log("Error while adding data to cart");
    }
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
