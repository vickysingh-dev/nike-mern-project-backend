// creating the dotenv
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});

// defining the port
const PORT = process.env.PORT;

// importing the  express module
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

// initiating the request to connect to mongoose
require("./db/conn");

app.use(express.json());

// routing
app.use(require("./router/auth"));

// load data
app.use(require("./router/load"));

// send comment
app.use(require("./router/comment"));


// connecting nodejs
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})