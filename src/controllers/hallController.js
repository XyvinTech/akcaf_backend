const responseHandler = require("../helpers/responseHandler");
const Booking = require("../models/bookingModel");
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
    const findBooking = await Booking.findOne({ day, time });
    if (findBooking) {
      return responseHandler(res, 400, "Booking already exists");
    }

    req.body.user = req.userId;

    const newHallBooking = await Booking.create(req.body);
    if (newHallBooking) {
      return responseHandler(
        res,
        201,
        "Hall Booking created successfullyy",
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
