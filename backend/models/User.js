// Import mongoose to define our user schema and model
const mongoose = require("mongoose");
// Import bcrypt to hash and compare passwords securely
const bcrypt = require("bcrypt");

// Create a new Mongoose schema for our User
const UserSchema = new mongoose.Schema({
  // Email field, required and unique
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Hashed password field, required
  password: {
    type: String,
    required: true,
  },
  // Optional role field for role-based authentication (e.g., 'admin', 'user')
  role: {
    type: String,
    default: "user",
  },
});

// Pre-save hook to hash the password before saving to the database
UserSchema.pre("save", async function (next) {
  // Only hash if the password is new or modified
  if (!this.isModified("password")) {
    return next();
  }
  // Generate a salt and hash the password
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Method to compare candidate (plain) password with the stored hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the model so we can use it in other files
module.exports = mongoose.model("User", UserSchema);
