const jwt = require("jsonwebtoken");
const User = require("./../model/userSchema");

const userAuthenticate = async function (req, res, next) {
    try {
        const token = req.cookies.jwtoken;

        if (token) {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

            const rootUser = await User.findOne({
                _id: verifyToken._id,
            });

            if (!rootUser) {
                req.flag = false;
            } else {
                req.rootUser = rootUser.toJSON();
                req.flag = true;
            }
        } else {
            req.flag = false;
        }

        next();
    } catch (err) {
        console.log("The error is ", err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = userAuthenticate;
