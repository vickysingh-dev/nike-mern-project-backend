const jwt = require("jsonwebtoken");
const User = require("./../model/userSchema");

const userAuthenticate = async function (req, res, next) {
    try {
        const token = req.cookies.jwtoken;
        console.log("The token from the userAuthenticate part is ", token);

        if (token) {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

            const rootUser = await User.findOne({
                _id: verifyToken._id,
                // "tokens.token": token,
            });

            if (!rootUser) {
                req.flag = false;
            } else {
                req.rootUser = rootUser;
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
