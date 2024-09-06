const { getMessaging } = require("firebase-admin/messaging");

const sendInAppNotification = async (fcm, title, body, media = null) => {
  try {
    const message = {
      notification: {
        title,
        body,
        ...(media && { image: media }),
      },
      token: fcm,
    };

    getMessaging()
      .send(message)
      .then((res) => {
        console.log("🚀 ~ getMessaging ~ res:", res);
      })
      .catch((err) => {
        console.log("🚀 ~ getMessaging ~ err:", err);
      });
  } catch (error) {
    console.log("🚀 ~ sendInAppNotification ~ error:", error);
  }
};

module.exports = sendInAppNotification;
