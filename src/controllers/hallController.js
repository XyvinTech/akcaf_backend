const responseHandler = require("../helpers/responseHandler");
const Booking = require("../models/bookingModel");
const Time = require("../models/timeModel");
const User = require("../models/userModel");
const validations = require("../validations");

exports.createHallBooking = async (req, res) => {
  try {
    const { userId } = req;
    const fetchUser = await User.findById(userId);
    if (!fetchUser) {
      return responseHandler(res, 404, "User not found");
    }

    if (fetchUser.role === "member") {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { error } = validations.createBooking.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const { day, time, hall } = req.body;

    const bookingStartTime = new Date(`1970-01-01T${time.start}Z`);
    const bookingEndTime = new Date(`1970-01-01T${time.end}Z`);

    const findBooking = await Booking.findOne({
      hall,
      day,
      "time.start": bookingStartTime.toISOString(),
      "time.end": bookingEndTime.toISOString(),
    });

    if (findBooking) {
      return responseHandler(res, 400, "Booking already exists");
    }

    const findTime = await Time.findOne({ day });
    if (!findTime) {
      return responseHandler(res, 400, "Time not found");
    }

    const hallStartTime = new Date(`1970-01-01T${findTime.start}Z`);
    const hallEndTime = new Date(`1970-01-01T${findTime.end}Z`);

    if (hallStartTime > bookingStartTime || hallEndTime < bookingEndTime) {
      return responseHandler(res, 400, "Time not available");
    }

    const allBookings = await Booking.find({ day });
    for (let booking of allBookings) {
      const existingStartTime = new Date(`1970-01-01T${booking.time.start}Z`);
      const existingEndTime = new Date(`1970-01-01T${booking.time.end}Z`);

      if (
        (bookingStartTime >= existingStartTime &&
          bookingStartTime < existingEndTime) ||
        (bookingEndTime > existingStartTime &&
          bookingEndTime <= existingEndTime)
      ) {
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
        "Hall Booking created successfully",
        newHallBooking
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
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
