// creating the dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// defining the port
const PORT = process.env.PORT || 3000;

// importing the  express module
const express = require("express");
const app = express();

// using cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// importing cors
const cors = require("cors");
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// initiating the request to connect to mongoose
require("./db/conn");

app.get("/testing", (req, res) => {
    res.send("hello world");
});

app.use(express.json());

// routing
app.use(require("./router/auth"));

// reset password
app.use(require("./router/resetPass"));

// load data
app.use(require("./router/load"));

// add items to user cart
app.use(require("./router/cart"));

// send comment
app.use(require("./router/comment"));

// connecting nodejs
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
