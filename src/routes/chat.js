const express = require("express");
const chatController = require("../controllers/chatController");
const authVerify = require("../middlewares/authVerify");
const chatRoute = express.Router();

chatRoute.use(authVerify);
