const admin = require("firebase-admin");
const User = require("../../models/userModel");

const getUserFCM = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    return user.fcm;
  }
  return null;
};

const subscribeFirebase = async (userId, topic) => {
  let userFCM = await getUserFCM(userId);
  if (userFCM) {
    admin
      .messaging()
      .subscribeToTopic(user_token, `/topics/${topic}`)
      .then((response) => {
        console.log("🚀 ~ subscribeFirebase ~ response:", response);
      })
      .catch((error) => {
        console.log("🚀 ~ subscribeFirebase ~ error:", error);
      });
  } else {
    console.log(
      `${userId} Subscribed to topic failed at ${topic} due to Missing Token`
    );
    return;
  }
};

const sendNotificationTopic = async (topic, message) => {
  let notification_message = {
    notification: {
      title: message.title,
      body: message.body,
    },
    data: {
      type: message.type,
      id: message.id,
    },
    topic: topic,
  };
  admin
    .messaging()
    .send(notification_message)
    .then((response) => {
      console.log("🚀 ~ sendNotificationTopic ~ response:", response);
    })
    .catch((error) => {
      console.log("🚀 ~ sendNotificationTopic ~ error:", error);
    });
};

module.exports = {
  subscribeFirebase,
  sendNotificationTopic,
};
