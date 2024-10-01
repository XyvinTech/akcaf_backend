require("dotenv").config();
const { EMAIL_ID, PASSWORD } = process.env;
const nodemailer = require("nodemailer");

const sendSelfMail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ID,
        pass: PASSWORD,
      },
    });

    const mailOptions = {
      from: data.from,
      to: EMAIL_ID,
      subject: data.subject,
      text: data.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("🚀 ~ sendSelfMail ~ error:", error);
      } else {
        console.log("🚀 ~ Email sent: ~ response: " + info.response);
      }
    });
  } catch (error) {
    console.log("🚀 ~ sendSelfMail ~ error:", error);
  }
};

module.exports = sendSelfMail;
