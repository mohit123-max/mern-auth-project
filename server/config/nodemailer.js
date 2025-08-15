import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : "ms7920475@gmail.com",
        pass : process.env.SMTP_PASS
    }
});

export default transporter;

