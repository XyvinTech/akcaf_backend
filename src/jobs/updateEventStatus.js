const cron = require("node-cron");
const moment = require("moment-timezone");
const Event = require("../models/eventModel");
const { getMessaging } = require("firebase-admin/messaging");
const Notification = require("../models/notificationModel");
require("dotenv").config();

cron.schedule("* * * * *", async () => {
  const now = moment().tz("Asia/Kolkata");

  try {
    //* Update "pending" events to "live" and send notifications
    // const progressEvents = await Event.find({
    //   status: { $in: ["pending"] },
    //   startTime: { $lte: now.toDate() },
    // });

    // if (progressEvents.length > 0) {
    //   await Promise.all(
    //     progressEvents.map(async (event) => {
    //       event.status = "live";
    //       await event.save();

    //       const data = event.rsvp.map((rsvp) => ({
    //         user: rsvp._id,
    //         read: false,
    //       }));

    //       await Notification.create({
    //         users: data,
    //         subject: `Event ${event.eventName} is now live!`,
    //         content: `The event ${event.eventName} has started. Join now!`,
    //         link: event.type === "Online" ? event.link : event.venue,
    //         type: "in-app",
    //       });
    //     })
    //   );

    //   const liveNotifications = progressEvents.map((event) => ({
    //     notification: {
    //       title: `Event ${event.eventName} is now live!`,
    //       body: `The event ${event.eventName} has started. Join now!`,
    //     },
    //     topic: `event_${event._id}`,
    //   }));

    //   await getMessaging().sendEach(liveNotifications);
    //   console.log(`Updated ${progressEvents.length} events to live`);
    // }

    //* Update "live" events to "completed" and send notifications
    // const doneEvents = await Event.find({
    //   status: "live",
    //   endDate: { $lte: now.toDate() },
    // });

    // if (doneEvents.length > 0) {
    //   await Promise.all(
    //     doneEvents.map(async (event) => {
    //       event.status = "completed";
    //       await event.save();

    //       const data = event.rsvp.map((rsvp) => ({
    //         user: rsvp._id,
    //         read: false,
    //       }));

    //       await Notification.create({
    //         users: data,
    //         subject: `Event ${event.eventName} is now completed!`,
    //         content: `The event ${event.eventName} has ended. Thank you for participating!`,
    //         type: "in-app",
    //       });
    //     })
    //   );

    //   const completedNotifications = doneEvents.map((event) => ({
    //     notification: {
    //       title: `Event ${event.eventName} is now completed!`,
    //       body: `The event ${event.eventName} has ended. Thank you for participating!`,
    //     },
    //     topic: `event_${event._id}`,
    //   }));

    //   await getMessaging().sendEach(completedNotifications);
    //   console.log(`Updated ${doneEvents.length} events to completed`);
    // }
  } catch (err) {
    console.error("Error updating events:", err);
  }
});
