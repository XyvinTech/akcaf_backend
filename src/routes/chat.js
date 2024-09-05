const express = require("express");
const chatController = require("../controllers/chatController");
const authVerify = require("../middlewares/authVerify");
const chatRoute = express.Router();

chatRoute.use(authVerify);

chatRoute.post("/send-message/:id", chatController.sendMessage);
chatRoute.post("/create-group", chatController.createGroup);
chatRoute.get("/get-chats", chatController.getChats);
chatRoute.get("/group-message/:id", chatController.getGroupMessage);
chatRoute.get("/between-users/:id", chatController.getBetweenUsers);
chatRoute.get("/list-group", chatController.getGroupList);

module.exports = chatRoute;
