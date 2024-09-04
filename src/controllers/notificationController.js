const responseHandler = require("../helpers/responseHandler");
const Notification = require("../models/notificationModel");
const validations = require("../validations");
const User = require("../models/userModel");
const sendMail = require("../utils/sendMail");

exports.createNotification = async (req, res) => {
  try {
    const { error } = validations.createNotificationSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    let userMail = [];
    const { users, media } = req.body;

    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        const id = users[i].user;
        const findUser = await User.findById(id);
        if (findUser) {
          userMail.push(findUser.email);
        }
      }
    }

    const attachments = media
      ? [
          {
            filename: media.split("/").pop(),
            path: media,
          },
        ]
      : [];

    const data = {
      to: userMail,
      subject: req.body.subject,
      text: req.body.content,
      attachments: attachments,
      link: req.body.link,
    };

    await sendMail(data);

    const createNotification = await Notification.create(req.body);
    return responseHandler(
      res,
      200,
      `Notification created successfully..!`,
      createNotification
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
