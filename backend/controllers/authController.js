// Import our User model
const User = require("../models/User");
// Import validationResult to check for validation errors
const { validationResult } = require("express-validator");

exports.registerUser = async (req, res) => {
  try {
    // Check for any validation errors (provided by express-validator in the routes)
    const errors = validationResult(req);
    // If errors exist, return them as a 400 (Bad Request)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure email and password from the request body
    const { email, password, role } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email is already in use." });
    }

    // Default role is 'user', only an admin can create another admin
    let assignedRole = "user";
    if (
      role === "admin" &&
      req.session.user &&
      req.session.user.role === "admin"
    ) {
      assignedRole = "admin";
    }

    // Create a new user instance
    const newUser = new User({ email, password, role: assignedRole });

    // Save user to the database (password gets hashed via our pre-save hook)
    await newUser.save();

    // Store minimal user info in session
    req.session.user = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    // Respond with a success message or redirect (here, we choose JSON)
    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    // Log any errors and return a 500 (Server Error)
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract email and password from request
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    // If user doesn't exist, return error
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    // Compare passwords using our model's method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    // Store user info in session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Respond with success
    return res.status(200).json({
      msg: "Logged in successfully",
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = (req, res) => {
  // Destroy the session on the server side
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to log out" });
    }
    // Clear the cookie from the client
    res.clearCookie("connect.sid");
    // Respond with success or redirect
    return res.status(200).json({ msg: "Logged out successfully" });
  });
};
