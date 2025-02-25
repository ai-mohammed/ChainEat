const Restaurant = require("../models/Restaurant");

// CREATE a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, cuisine, rating, description } = req.body;
    const newRestaurant = await Restaurant.create({
      name,
      address,
      cuisine,
      rating,
      description,
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ a single restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a restaurant by ID
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validations on update
      }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a restaurant by ID
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
