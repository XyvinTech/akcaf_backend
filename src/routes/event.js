const express = require("express");
const eventController = require("../controllers/eventController");
const eventRoute = express.Router();
const authVerify = require("../middlewares/authVerify");

eventRoute.use(authVerify);

eventRoute.route("/").post(eventController.createEvent);

eventRoute.get("/list", eventController.getAllEvents);

eventRoute
  .route("/single/:id")
  .put(eventController.editEvent)
  .get(eventController.getSingleEvent)
  .delete(eventController.deleteEvent)
  .patch(eventController.addRSVP);

module.exports = eventRoute;
