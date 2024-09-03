const express = require("express");
const userController = require("../controllers/userController");
const authVerify = require("../middlewares/authVerify");
const userRoute = express.Router();

userRoute.post("/send-otp", userController.sendOtp);
userRoute.post("/verify", userController.verifyUser);
userRoute.post("/login", userController.loginUser);
userRoute.get("/app-version", userController.getVersion);
userRoute.use(authVerify);

userRoute.get("/", userController.fetchUser);

userRoute.patch("/update", userController.updateUser);

userRoute.post("/admin", userController.createUser);

userRoute
  .route("/admin/single/:id")
  .put(userController.editUser)
  .get(userController.getUser)
  .delete(userController.deleteUser);

userRoute.get("/admin/list", userController.getAllUsers);

module.exports = userRoute;
