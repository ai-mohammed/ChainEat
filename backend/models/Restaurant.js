// Initialize mongoose
const mongoose = require("mongoose");
// create restaurant schema with name, address, cuisine, rating, and description
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  userRatings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
    },
  ],
});
// Export the model
module.exports = mongoose.model("Restaurant", restaurantSchema);
