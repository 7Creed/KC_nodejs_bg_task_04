const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
  port: 465,
});

async function sendEmail(to, subject = "Password Reset", token) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text: `You requested a password reset. Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error(`Failed to send email: ${err}`);
    throw err;
  }
}

module.exports = {
  sendEmail,
};
