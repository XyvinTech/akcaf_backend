const responseHandler = require("../helpers/responseHandler");
const Booking = require("../models/bookingModel");
const Time = require("../models/timeModel");
const validations = require("../validations");

exports.createTime = async (req, res) => {
  try {
    const { error } = validations.bulKaddTimeSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    for (const entry of req.body.addTimeSchema) {
      const { day, start, end } = entry;

      if (!start && !end) {
        await Time.findOneAndDelete({ day });
      } else {
        await Time.findOneAndUpdate(
          { day },
          { start, end },
          { new: true, upsert: true }
        );
      }
    }

    return responseHandler(res, 201, "Time data processed successfully");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getTimes = async (req, res) => {
  try {
    const findTime = await Time.find();
    if (findTime) {
      return responseHandler(res, 200, "Time found", findTime);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getBookingByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return responseHandler(res, 400, "Date parameter is required");
    }

    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    const findBooking = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (findBooking.length > 0) {
      return responseHandler(res, 200, "Booking found", findBooking);
    }

    return responseHandler(res, 404, "Booking not found");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
