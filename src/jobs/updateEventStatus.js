const cron = require("node-cron");
const moment = require("moment-timezone");
const Event = require("../models/eventModel");
const { getMessaging } = require("firebase-admin/messaging");
const Notification = require("../models/notificationModel");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  const now = moment().tz("Asia/Kolkata");
  console.log("🚀 ~ cron.schedule ~ now:", now)
  const currentDateTime = moment.utc(now.format("YYYY-MM-DDTHH:mm")).toDate();
  console.log("🚀 ~ cron.schedule ~ currentDateTime:", currentDateTime)

  try {
    //* Update events from "pending" to "live" and send notification
    const progressEvents = await Event.find({
      status: "pending",
      startDate: { $lte: now.toDate() },
      startTime: { $lte: currentDateTime },
    });

    for (const event of progressEvents) {
      event.status = "live";
      await event.save();
      await Notification.create({
        users: event.rsvp,
        subject: `Event "${event.eventName}" is now live!`,
        content: `The event "${event.eventName}" has started. Join now!`,
        link: event.type === "Online" ? event.link : event.venue,
        type: "in-app",
      });

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
      endDate: { $lte: now.toDate() },
      endTime: { $lte: currentDateTime },
    });

    for (const event of doneEvents) {
      event.status = "completed";
      await event.save();
      await Notification.create({
        users: event.rsvp,
        subject: `Event "${event.eventName}" is now completed!`,
        content: `The event "${event.eventName}" has ended. Thank you for participating!`,
        type: "in-app",
      });

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
