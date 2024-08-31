const express = require("express");
const promotionRoute = express.Router();
const promotionController = require("../controllers/promotionController");
const authVerify = require("../middlewares/authVerify");

promotionRoute.use(authVerify);

promotionRoute.post("/", promotionController.createPromotion);

promotionRoute
  .route("/single/:id")
  .get(promotionController.getPromotion)
  .put(promotionController.updatePromotion)
  .delete(promotionController.deletePromotion);

module.exports = promotionRoute;
