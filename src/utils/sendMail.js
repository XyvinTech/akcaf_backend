require("dotenv").config();
const { EMAIL_ID, PASSWORD } = process.env;
const nodemailer = require("nodemailer");

const sendMail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      secure: true,
      port: 465,
      auth: {
        user: EMAIL_ID,
        pass: PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_ID,
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
