const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  authenticateUser,
  getProfile,
} = require("../controller/userController");

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.get("/profile", authenticateUser, getProfile);

module.exports = userRoutes;
