require("dotenv").config();
const { NODE_EMAIL_ID, NODE_PASS="SKU6 n8J0 6X3T" } = process.env;
const nodemailer = require("nodemailer");

const sendMail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      secure: true,
      port: 465,
      auth: {
        user: NODE_EMAIL_ID,
        pass: NODE_PASS,
      },
    });

    const mailOptions = {
      from: NODE_EMAIL_ID,
      to: data.to,
      subject: data.subject,
      text: data.text,
      attachments: data.attachments,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("🚀 ~ sendMail ~ error:", error);
      } else {
        console.log("🚀 ~ Email sent: ~ response: " + info.response);
      }
    });
  } catch (error) {
    console.log("🚀 ~ sendMail ~ error:", error);
  }
};

module.exports = sendMail;
