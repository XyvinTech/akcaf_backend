const express = require("express");
const hallController = require("../controllers/hallController");
const authVerify = require("../middlewares/authVerify");
const hallRoute = express.Router();

hallRoute.use(authVerify);

hallRoute.post("/", hallController.createHallBooking);
hallRoute.get("/single/:id", hallController.getHallBooking);
hallRoute.get("/list", hallController.getHallBookings);
hallRoute.put("/edit/:id", hallController.editHallBooking);
hallRoute.post("/new", hallController.createHall);
hallRoute.get("/dropdown", hallController.getDropdown);
hallRoute.get("/calendar/:month", hallController.getCalendar);
module.exports = hallRoute;
