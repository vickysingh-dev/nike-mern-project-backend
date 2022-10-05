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
    cart: [
        {
            _id: {
                type: String,
            },
            size: {
                type: String,
            },
            quantity: {
                type: Number,
            },
        },
    ],
    order: [
        {
            _id: {
                type: String,
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

userSchema.methods.updateCart = async function (item_id, quantity) {
    try {
        if (quantity < 1) {
            this.cart = this.cart.filter((value) => {
                return value._id != item_id;
            });
            await this.save();
        } else {
            this.cart.forEach((value) => {
                if (value._id == item_id) {
                    value.quantity = quantity;
                }
            });
            await this.save();
        }
        return this.cart;
    } catch (err) {
        console.log(err);
        console.log("Error while updating the change of quantit request.");
    }
};

userSchema.methods.checkout = async function () {
    try {
        this.order = this.cart;
        this.cart = [];
        await this.save();
        return this;
    } catch (err) {
        console.log(err);
    }
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
