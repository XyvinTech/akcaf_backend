const responseHandler = require("../helpers/responseHandler");
const Notification = require("../models/notificationModel");
const validations = require("../validations");

exports.createNotification = async (req, res) => {
  try {
    const { error } = validations.createNotificationSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const createNotification = await Notification.create(req.body);
    return responseHandler(
      res,
      200,
      `Notification created successfull..!`,
      createNotification
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
