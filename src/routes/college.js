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

collegeRoute.get("/bulk", collegeController.createCollegeBulk);
collegeRoute.get("/pst-check/:id", collegeController.pstCheck);
collegeRoute.get("/role-check/:role", collegeController.getCollegesWithRole);

module.exports = collegeRoute;
