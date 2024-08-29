const express = require("express");
const roleController = require("../controllers/roleController");
const roleRoute = express.Router();

roleRoute.post("/", roleController.createRole);

roleRoute
  .route("/single/:id")
  .get(roleController.getRole)
  .put(roleController.editRole)
  .delete(roleController.deleteRole);

module.exports = roleRoute;
