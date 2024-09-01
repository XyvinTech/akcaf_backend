const express = require("express");
const courseController = require("../controllers/courseController");
const authVerify = require("../middlewares/authVerify");
const courseRoute = express.Router();

courseRoute.use(authVerify);

courseRoute.post("/", courseController.createCourse);

courseRoute.get("/list", courseController.getAllCourses);

module.exports = courseRoute;
