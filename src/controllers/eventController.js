const checkAccess = require("../helpers/checkAccess");
const responseHandler = require("../helpers/responseHandler");
const validations = require("../validations");
const Event = require("../models/eventModel");

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
        `New Event created successfull..!`,
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
      `Event updated successfully!`,
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
    return responseHandler(res, 200, `Event deleted successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return responseHandler(res, 404, "Event not found");
    }
    return responseHandler(res, 200, "Event retrieved successfully", event);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return responseHandler(res, 404, "No events found");
    }
    return responseHandler(res, 200, "Events retrieved successfully", events);
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
    return responseHandler(res, 200, "RSVP added successfully");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
