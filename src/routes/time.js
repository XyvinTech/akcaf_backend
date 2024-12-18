const express = require("express");
const timeController = require("../controllers/timeController");
const authVerify = require("../middlewares/authVerify");
const timeRoute = express.Router();

timeRoute.use(authVerify);

timeRoute.post("/", timeController.createTime);
timeRoute.put("/edit/:day", timeController.editTime);
timeRoute.get("/list", timeController.getTimes);
timeRoute.get("/single/:day", timeController.getTime);
timeRoute.delete("/delete/:day", timeController.deleteTime);

module.exports = timeRoute;
