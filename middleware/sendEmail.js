const nodemailer = require("nodemailer");

require("dotenv").config({ path: "./config.env" });

const sendEmail = async ({ email, subject, text }) => {
    details = {
        from: process.env.SERVER_EMAIL_ID,
        to: email,
        subject: subject,
        text: text,
    };

    const prom = new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SERVER_EMAIL_ID,
                pass: process.env.SERVER_EMAIL_PASSWORD,
            },
            port: 465,
            host: "smtp.gmail.com",
        });

        transporter.sendMail(details, (err) => {
            if (err) {
                console.log("User Sending Invalid Email Id.");
                resolve(false);
            } else {
                resolve(true);
                console.log("Email sent successfully!");
            }
        });
    });

    return await prom.then((para) => {
        return para;
    });
};

module.exports = sendEmail;
