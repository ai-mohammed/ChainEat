// routes/authRoutes.js

// Import Express and create a new Router
const express = require("express");
const router = express.Router();
// Import express-validator's check/body methods for validations
const { body } = require("express-validator");

// Import our auth controller
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

// Validation rules for registration
// - Ensure email is valid, password has at least 6 chars, etc.
const registerValidation = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Route to register a new user
// 1) apply registerValidation
// 2) call registerUser from authController
router.post("/register", registerValidation, registerUser);

// Route to log in a user
// 1) apply loginValidation
// 2) call loginUser from authController
router.post("/login", loginValidation, loginUser);

// Route to log out
router.get("/logout", logoutUser);

// Export the router to be used in server.js
module.exports = router;
