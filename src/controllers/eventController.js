const checkAccess = require("../helpers/checkAccess");
const responseHandler = require("../helpers/responseHandler");
const validations = require("../validations");
const Event = require("../models/eventModel");
const { getMessaging } = require("firebase-admin/messaging");
const User = require("../models/userModel");

exports.createEvent = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { error } = validations.createEventSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const existingEvent = await Event.findOne({
      eventName: req.body.eventName,
    });
    if (existingEvent) {
      return responseHandler(
        res,
        400,
        `An event with the name "${req.body.eventName}" already exists.`
      );
    }
    const newEvent = await Event.create(req.body);
    if (newEvent)
      return responseHandler(
        res,
        201,
        `New Event created successfully..!`,
        newEvent
      );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.editEvent = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { error } = validations.editEventSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return responseHandler(res, 404, "Event not found");
    }
    return responseHandler(
      res,
      200,
      `Event updated successfullyy!`,
      updatedEvent
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("eventManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return responseHandler(res, 404, "Event not found");
    }
    return responseHandler(res, 200, `Event deleted successfullyy`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "rsvp",
      "fullName phone memberId"
    );
    const mappedData = {
      ...event._doc,
      rsvpCount: event.rsvp.length,
      rsvp: event.rsvp.map((rsvp) => {
        return {
          name: rsvp.fullName,
          phone: rsvp.phone,
          memberId: rsvp.memberId,
        };
      }),
    };
    if (!event) {
      return responseHandler(res, 404, "Event not found");
    }
    return responseHandler(
      res,
      200,
      "Event retrieved successfullyy",
      mappedData
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const filter = {
      status: { $ne: "completed" },
    };
    const events = await Event.find(filter)
      .populate()
      .sort({ createdAt: -1, _id: 1 });
    if (!events || events.length === 0) {
      return responseHandler(res, 404, "No events found");
    }
    return responseHandler(res, 200, "Events retrieved successfullyy", events);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllEventsForAdmin = async (req, res) => {
  try {
    const { pageNo = 1, status, limit = 10, search } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};
    if (search) {
      filter.$or = [{ eventName: { $regex: search, $options: "i" } }];
    }
    if (status) {
      filter.status = status;
    }
    const events = await Event.find(filter)
      .populate("rsvp", "fullName phone memberId")
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
      .lean();
    const mappedEvents = events.map((event) => {
      return {
        ...event,
        rsvpCount: event.rsvp.length,
        rsvp: event.rsvp.map((rsvp) => {
          return {
            _id: rsvp._id,
            name: rsvp.fullName,
            memberId: rsvp.memberId,
          };
        }),
      };
    });
    if (!events || events.length === 0) {
      return responseHandler(res, 404, "No events found");
    }
    return responseHandler(
      res,
      200,
      "Events retrieved successfullyy",
      mappedEvents
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.addRSVP = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return responseHandler(res, 400, "Event Id is required");
    const findEvent = await Event.findById(id);
    if (!findEvent) {
      return responseHandler(res, 404, "Event not found");
    }
    if (findEvent.rsvp.includes(req.userId)) {
      return responseHandler(res, 400, "You have already RSVPed to this event");
    }
    findEvent.rsvp.push(req.userId);
    await findEvent.save();

    const user = await User.findById(req.userId).select("fcm");

    const topic = `event_${id}`;
    const fcmToken = user.fcm;
    await getMessaging().subscribeToTopic(fcmToken, topic);
    return responseHandler(res, 200, "RSVP added successfullyy");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getRegEvents = async (req, res) => {
  try {
    const regEvents = await Event.find({
      rsvp: { $elemMatch: { $eq: req.userId } },
    });
    if (!regEvents || regEvents.length === 0) {
      return responseHandler(res, 404, "No events found");
    }
    return responseHandler(
      res,
      200,
      "Events retrieved successfullyy",
      regEvents
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
