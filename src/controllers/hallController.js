const mongoose = require("mongoose");
const moment = require("moment-timezone");
const responseHandler = require("../helpers/responseHandler");
const Booking = require("../models/bookingModel");
const Time = require("../models/timeModel");
const User = require("../models/userModel");
const validations = require("../validations");
const Hall = require("../models/hallModel");

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

    const { day, time, hall, date, eventName, description } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const bookingStartTime = new Date(`${today}T${time.start}:00Z`);
    const bookingEndTime = new Date(`${today}T${time.end}:00Z`);

    const bookingStartTimeOnly = bookingStartTime
      .toISOString()
      .split("T")[1]
      .split("Z")[0];
    const bookingEndTimeOnly = bookingEndTime
      .toISOString()
      .split("T")[1]
      .split("Z")[0];

    if (bookingStartTime >= bookingEndTime) {
      return responseHandler(res, 400, "Start time must be before end time");
    }

    const findTime = await Time.findOne({ day });
    if (!findTime) {
      return responseHandler(res, 400, "Time not found for the selected day");
    }

    const hallStartTime = new Date(findTime.start);
    const hallEndTime = new Date(findTime.end);

    const hallStartTimeIST = convertToIST(hallStartTime);
    const hallEndTimeIST = convertToIST(hallEndTime);

    if (
      bookingStartTimeOnly < hallStartTimeIST ||
      bookingEndTimeOnly > hallEndTimeIST
    ) {
      return responseHandler(
        res,
        400,
        "Booking time not within available hall hours"
      );
    }

    const existingBookings = await Booking.find({ day, hall });

    for (let booking of existingBookings) {
      const existingStartTime = new Date(
        `${today}T${booking.time.start.split("T")[1]}`
      );
      const existingEndTime = new Date(
        `${today}T${booking.time.end.split("T")[1]}`
      );

      // Add 30-minute preparation buffer to existing bookings
      const bufferEndTime = new Date(existingEndTime.getTime() + 30 * 60000);

      const isOverlap =
        (bookingStartTime >= existingStartTime &&
          bookingStartTime < bufferEndTime) ||
        (bookingEndTime > existingStartTime &&
          bookingEndTime <= bufferEndTime) ||
        (bookingStartTime <= existingStartTime &&
          bookingEndTime >= bufferEndTime);

      if (isOverlap) {
        const suggestedStartTime = new Date(bufferEndTime.getTime());
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

    const newHallBooking = await Booking.create({
      day,
      hall,
      date,
      eventName,
      description,
      user: userId,
      time: {
        start: bookingStartTime.toISOString(),
        end: bookingEndTime.toISOString(),
      },
    });

    return responseHandler(
      res,
      201,
      "Hall booking created successfully",
      newHallBooking
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getHallBookings = async (req, res) => {
  try {
    const filter = {};
    const {
      pageNo = 1,
      limit = 10,
      status,
      hall,
      userName,
      eventName,
    } = req.query;
    const skipCount = 10 * (pageNo - 1);

    if (req.role === "user") {
      const findUser = await User.findById(req.userId);
      if (findUser.role === "member") {
        return responseHandler(
          res,
          404,
          "You don't have permission to perform this action"
        );
      }
      filter["user"] = new mongoose.Types.ObjectId(findUser._id);
    }

    if (status) {
      filter.status = status;
    }

    if (eventName) {
      filter.$or = [{ eventName: { $regex: eventName, $options: "i" } }];
    }

    if (userName) {
      filter.$or = [{ "user.fullName": { $regex: userName, $options: "i" } }];
    }

    if (hall) {
      filter.hall = new mongoose.Types.ObjectId(hall);
    }

    const findBookings = await Booking.find(filter)
      .populate("hall")
      .populate("user")
      .skip(skipCount)
      .limit(limit)
      .sort({ _id: -1 });

    const totalCount = await Booking.countDocuments(filter);

    const mappedData = findBookings.map((booking) => {
      const formattedStart = booking.time?.start
        ? moment
            .tz(booking.time.start, "YYYY-MM-DDTHH:mm:ss", "Asia/Kolkata")
            .format("hh:mm A")
        : "N/A";
      const formattedEnd = booking.time?.end
        ? moment
            .tz(booking.time.end, "YYYY-MM-DDTHH:mm:ss", "Asia/Kolkata")
            .format("hh:mm A")
        : "N/A";
      return {
        ...booking._doc,
        user: booking.user.fullName || "N/A",
        userName: booking.user.fullName || "N/A",
        hall: booking.hall.name || "N/A",
        time: {
          start: formattedStart,
          end: formattedEnd,
        },
      };
    });

    if (mappedData) {
      return responseHandler(
        res,
        200,
        "Bookings found",
        mappedData,
        totalCount
      );
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

exports.createHall = async (req, res) => {
  try {
    const { error } = validations.createHall.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const findHall = await Hall.findOne({ name: req.body.name });
    if (findHall) {
      return responseHandler(res, 400, "Hall already exists");
    }
    const newHall = await Hall.create(req.body);
    if (newHall) {
      return responseHandler(res, 201, "Hall created successfully", newHall);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getDropdown = async (req, res) => {
  try {
    const halls = await Hall.find({ status: true });
    return responseHandler(res, 200, "Dropdown found successfullyy", halls);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getCalendar = async (req, res) => {
  try {
    let { month } = req.params;

    if (!month) {
      const currentDate = new Date();
      month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    const findBookings = await Booking.find({
      date: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(`${month}-31`),
      },
    });

    if (findBookings.length > 0) {
      return responseHandler(res, 200, "Bookings found", findBookings);
    } else {
      return responseHandler(res, 404, "No bookings found for this month");
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

function convertToIST(date) {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  return istDate.toISOString().split("T")[1].split("Z")[0];
}
