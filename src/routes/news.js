const express = require("express");
const newsController = require("../controllers/newsController");
const newsRoute = express.Router();

newsRoute.post("/", newsController.createNews);

newsRoute
  .route("/single/:id")
  .get(newsController.getNews)
  .put(newsController.updateNews)
  .delete(newsController.deleteNews);

module.exports = newsRoute;
