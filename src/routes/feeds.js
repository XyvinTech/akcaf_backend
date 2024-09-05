const express = require("express");
const feedsController = require("../controllers/feedsController");
const authVerify = require("../middlewares/authVerify");
const feedsRoute = express.Router();

feedsRoute.use(authVerify);

feedsRoute.post("/", feedsController.createFeeds);

feedsRoute.route("/single/:id").get(feedsController.getFeeds);
//   .put(feedsController.updateFeeds)
//   .delete(feedsController.deletefeeds);

feedsRoute.get("/list", feedsController.getAllFeeds);
feedsRoute.post("/like/:id", feedsController.likeFeed);
feedsRoute.post("/comment/:id", feedsController.commentFeed);

module.exports = feedsRoute;
