const responseHandler = require("../helpers/responseHandler");
const Course = require("../models/courseModel");
const validations = require("../validations");

exports.createCourse = async (req, res) => {
  try {
    const { error } = validations.createCourseSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const findCourse = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (findCourse) return responseHandler(res, 409, `Course already exists`);

    const newCourse = await Course.create(req.body);
    if (newCourse) {
      return responseHandler(
        res,
        201,
        `New Course created successfull..!`,
        newCourse
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (courses) {
      return responseHandler(res, 200, `All Courses`, courses);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
