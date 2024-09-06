const cron = require("node-cron");
const moment = require("moment-timezone");
const Event = require("../../models/eventModel");

cron.schedule("* * * * *", async () => {
  const now = moment().tz("Asia/Kolkata");
  const currentDate = now.format("YYYY-MM-DD");
  const currentTime = now.format("HH:mm");

  try {
    //* Update events from "pending" to "progress"
    const progressEvents = await Event.updateMany(
      {
        status: "pending",
        startDate: currentDate,
        startTime: {
          $lte: moment.utc(`${currentDate}T${currentTime}`).toDate(),
        },
      },
      { status: "live" },
      { new: true }
    );
    console.log(`Updated ${progressEvents.modifiedCount} events to live`);

    //* Update events from "progress" to "done"
    const doneEvents = await Event.updateMany(
      {
        status: "live",
        endDate: currentDate,
        endTime: {
          $lte: moment.utc(`${currentDate}T${currentTime}`).toDate(),
        },
      },
      { status: "completed" },
      { new: true }
    );
    console.log(`Updated ${doneEvents.modifiedCount} events to completed`);
  } catch (err) {
    console.error("Error updating events:", err);
  }
});
