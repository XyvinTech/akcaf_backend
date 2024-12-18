const express = require("express");
const hallController = require("../controllers/hallController");
const authVerify = require("../middlewares/authVerify");
const hallRoute = express.Router();

hallRoute.use(authVerify);

hallRoute.post("/", hallController.createHallBooking);
hallRoute.get("/list", hallController.getHallBookings);
hallRoute.put("/edit/:id", hallController.editHallBooking);

module.exports = hallRoute;
