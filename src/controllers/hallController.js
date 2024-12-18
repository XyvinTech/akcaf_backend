const responseHandler = require("../helpers/responseHandler");
const Booking = require("../models/bookingModel");
const Time = require("../models/timeModel");
const User = require("../models/userModel");
const validations = require("../validations");

exports.createHallBooking = async (req, res) => {
  try {
    const { error } = validations.createBooking.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const { day, time } = req.body;

    const bookingStartTime = new Date(`1970-01-01T${time.start}:00Z`);
    const bookingEndTime = new Date(`1970-01-01T${time.end}:00Z`);

    const allBookings = await Booking.find({ day });

    for (let booking of allBookings) {
      const existingStartTime = new Date(booking.time.start);
      const existingEndTime = new Date(booking.time.end);

      const isOverlap =
        (bookingStartTime >= existingStartTime &&
          bookingStartTime < existingEndTime) ||
        (bookingEndTime > existingStartTime &&
          bookingEndTime <= existingEndTime) ||
        (bookingStartTime <= existingStartTime &&
          bookingEndTime >= existingEndTime);

      if (isOverlap) {
        const suggestedStartTime = new Date(
          existingEndTime.getTime() + 30 * 60000
        );
        const suggestedStartTimeFormatted = suggestedStartTime
          .toISOString()
          .split("T")[1]
          .slice(0, 5);

        return responseHandler(
          res,
          400,
          `Booking time overlaps with an existing booking. Please add 30 minutes for preparation. Suggested start time: ${suggestedStartTimeFormatted}`
        );
      }
    }

    const findTime = await Time.findOne({ day });
    if (!findTime) {
      return responseHandler(res, 400, "Time not found for the selected day");
    }

    if (findTime.start > bookingStartTime || findTime.end < bookingEndTime) {
      return responseHandler(res, 400, "Time not available for booking");
    }

    req.body.user = req.userId;

    const newHallBooking = await Booking.create({
      ...req.body,
      time: {
        start: bookingStartTime.toISOString(),
        end: bookingEndTime.toISOString(),
      },
    });

    if (newHallBooking) {
      return responseHandler(
        res,
        201,
        "Hall booking created successfully",
        newHallBooking
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getHallBookings = async (req, res) => {
  try {
    const findBookings = await Booking.find();
    if (findBookings) {
      return responseHandler(res, 200, "Bookings found", findBookings);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.editHallBooking = async (req, res) => {
  try {
    const { error } = validations.editBooking.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Id is required");
    }
    const findBooking = await Booking.findById(id);
    if (!findBooking) {
      return responseHandler(res, 404, "Booking not found");
    }
    const updateBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateBooking) {
      return responseHandler(
        res,
        200,
        "Booking updated successfullyy",
        updateBooking
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getHallBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Id is required");
    }
    const findBooking = await Booking.findById(id);
    if (!findBooking) {
      return responseHandler(res, 404, "Booking not found");
    }
    return responseHandler(res, 200, "Booking found", findBooking);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
