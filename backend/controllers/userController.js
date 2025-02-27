// import User model from models directory
const User = require("../models/User");

// Get all users from the database

exports.getAllUsers = async (req, res) => {
  try {
    // Find all users in the database using Mongoose's find() method
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
