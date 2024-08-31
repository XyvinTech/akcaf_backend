const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

const chatNamespace = io.of("/api/v1/chat");

const userSocketMap = new Map();

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

chatNamespace.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  chatNamespace.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    chatNamespace.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, chatNamespace, getReceiverSocketId };
