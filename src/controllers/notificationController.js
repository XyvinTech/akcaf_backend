const responseHandler = require("../helpers/responseHandler");
const Notification = require("../models/notificationModel");
const validations = require("../validations");
const User = require("../models/userModel");
const sendMail = require("../utils/sendMail");
const sendInAppNotification = require("../utils/sendInAppNotification");

exports.createNotification = async (req, res) => {
  try {
    const { error } = validations.createNotificationSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    let { users, media, sendTo } = req.body;
    if (sendTo === "user") {
      if (users[0].user === "*") {
        const allUsers = await User.find({
          status: { $in: ["active", "awaiting_payment"] },
        }).select("_id fcm");
        users = allUsers.map((user) => user._id);
      }
    } else if (sendTo === "college") {
      if (users[0].user === "*") {
        const allUsers = await User.find({
          status: { $in: ["active", "awaiting_payment"] },
        }).select("_id fcm");
        users = allUsers.map((user) => user._id);
      } else {
        const allUsers = await User.find({
          status: { $in: ["active", "awaiting_payment"] },
          college: { $in: users.map((user) => user.user) },
        }).select("_id fcm");
        users = allUsers.map((user) => user._id);
      }
    }

    if (req.body.type === "email") {
      let userMail = [];

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
    } else if (req.body.type === "in-app") {
      let userFCM = [];
      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const id = users[i].user;
          const findUser = await User.findById(id);
          if (findUser) {
            if (!findUser.fcm) continue;
            userFCM.push(findUser.fcm);
          }
        }
      }
      await sendInAppNotification(
        userFCM,
        req.body.subject,
        req.body.content,
        media,
        "https://akcaf.page.link/notifications_page"
      );
    }

    const createNotification = await Notification.create(req.body);
    return responseHandler(
      res,
      200,
      `Notification created successfullyy..!`,
      createNotification
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    return responseHandler(
      res,
      200,
      `Notifications fetched successfullyy..!`,
      notifications
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req;

    const notifications = await Notification.find({
      users: {
        $elemMatch: {
          user: userId,
        },
      },
    })
      .sort({ createdAt: 1, _id: 1 })
      .limit(20);

    if (notifications.length > 0) {
      await Notification.updateMany(
        {
          users: {
            $elemMatch: {
              user: userId,
              read: false,
            },
          },
        },
        {
          $set: { "users.$.read": true },
        }
      );
    }

    return responseHandler(
      res,
      200,
      `Notifications fetched successfullyy..!`,
      notifications
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
