const express = require("express");
const adminController = require("../controllers/adminController");
const authVerify = require("../middlewares/authVerify");
const adminRoute = express.Router();

adminRoute.post("/login", adminController.loginAdmin);
adminRoute.get("/dashboard", adminController.getDashboard);

adminRoute.use(authVerify);

adminRoute
  .route("/")
  .post(adminController.createAdmin)
  .get(adminController.getAdmin);

adminRoute
  .route("/single/:id")
  .get(adminController.fetchAdmin)
  .put(adminController.editAdmin)
  .delete(adminController.deleteAdmin);

adminRoute.get("/list", adminController.getAllAdmins);
adminRoute.get("/approvals", adminController.getApprovals);
adminRoute.put("/approval/:id", adminController.approveUser);
adminRoute.get("/dropdown", adminController.getDropdown);
module.exports = adminRoute;
