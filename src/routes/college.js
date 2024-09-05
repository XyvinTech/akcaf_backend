const express = require("express");
const collegeController = require("../controllers/collegeController");
const authVerify = require("../middlewares/authVerify");
const collegeRoute = express.Router();

collegeRoute.use(authVerify);

collegeRoute.post("/", collegeController.createCollege);
collegeRoute
  .route("/single/:id")
  .put(collegeController.editCollege)
  .get(collegeController.getCollege)
  .delete(collegeController.deleteCollege);

collegeRoute.post("/bulk", collegeController.bulkCreateCollege);
collegeRoute.get("/list", collegeController.getAllColleges);
collegeRoute.get("/dropdown", collegeController.getCollegeDropdown);
collegeRoute.get(
  "/:collegeId/course/:courseId",
  collegeController.getCouseWise
);
collegeRoute.get(
  "/:collegeId/course/:courseId/batch/:batch",
  collegeController.getBatchWise
);

module.exports = collegeRoute;
