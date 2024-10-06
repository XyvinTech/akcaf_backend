const cron = require("node-cron");
const moment = require("moment-timezone");
const Event = require("../models/eventModel");
const { getMessaging } = require("firebase-admin/messaging");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  const now = moment().tz("Asia/Kolkata");
  const currentDate = now.format("YYYY-MM-DD");
  const currentTime = now.format("HH:mm");
  console.log(
    "🚀 ~ cron.schedule ~ moment.utc(`${currentDate}T${currentTime}`).toDate():",
    moment.utc(`${currentDate}T${currentTime}`).toDate()
  );

  try {
    //* Update events from "pending" to "live" and send notification
    const progressEvents = await Event.find({
      status: "pending",
      startDate: currentDate,
      startTime: {
        $lte: moment.utc(`${currentDate}T${currentTime}`).toDate(),
      },
    });

    for (const event of progressEvents) {
      event.status = "live";
      await event.save();

      const topic = `event_${event._id}`;
      const message = {
        notification: {
          title: `Event "${event.eventName}" is now live!`,
          body: `The event "${event.eventName}" has started. Join now!`,
        },
        topic: topic,
      };

      try {
        await getMessaging().send(message);
        console.log(`Notification sent for event ${event.eventName}`);
      } catch (err) {
        console.error(
          `Failed to send notification for event ${event.eventName}:`,
          err
        );
      }
    }

    console.log(`Updated ${progressEvents.length} events to live`);

    //* Update events from "live" to "completed" and send notification
    const doneEvents = await Event.find({
      status: "live",
      endDate: currentDate,
      endTime: {
        $lte: moment.utc(`${currentDate}T${currentTime}`).toDate(),
      },
    });

    for (const event of doneEvents) {
      event.status = "completed";
      await event.save();

      const topic = `event_${event._id}`;
      const message = {
        notification: {
          title: `Event "${event.eventName}" is now completed!`,
          body: `The event "${event.eventName}" has ended. Thank you for participating!`,
        },
        topic: topic,
      };

      try {
        await getMessaging().send(message);
        console.log(`Notification sent for completed event ${event.eventName}`);
      } catch (err) {
        console.error(
          `Failed to send notification for event ${event.eventName}:`,
          err
        );
      }
    }

    console.log(`Updated ${doneEvents.length} events to completed`);
  } catch (err) {
    console.error("Error updating events:", err);
  }
});
