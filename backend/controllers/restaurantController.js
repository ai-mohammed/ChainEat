// Import the Restaurant model from the models directory
const Restaurant = require("../models/Restaurant");

// CREATE a new restaurant

// Import the Restaurant model from the models directory
exports.createRestaurant = async (req, res) => {
  try {
    // Destructure the name, address, cuisine, rating, and description from the request body
    const { name, address, cuisine, rating, description } = req.body;
    // Create a new restaurant using the create method
    const newRestaurant = await Restaurant.create({
      name,
      address,
      cuisine,
      description,
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ all restaurants

// Import the Restaurant model from the models directory
exports.getAllRestaurants = async (req, res) => {
  try {
    // Use the find method to retrieve all restaurants from the database
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ a single restaurant by ID

// Import the Restaurant model from the models directory
exports.getRestaurantById = async (req, res) => {
  try {
    // Get the restaurant ID from the URL parameter
    const { id } = req.params;
    // Use the findById method to retrieve a single restaurant by ID
    const restaurant = await Restaurant.findById(id);
    // If the restaurant was not found, return a 404 response
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    // If the restaurant was found, return the retrieved document
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a restaurant by ID

// Import the Restaurant model from the models directory
exports.updateRestaurant = async (req, res) => {
  try {
    // Get the restaurant ID from the URL parameter
    const { id } = req.params;
    // Get the updated data from the request body
    const updateData = req.body;
    // Update the restaurant using the findByIdAndUpdate method
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validations on update
      }
    );
    // If the restaurant was not found, return a 404 response
    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a restaurant by ID

// Import the Restaurant model from the models directory
exports.deleteRestaurant = async (req, res) => {
  try {
    // Get the restaurant ID from the URL parameter
    const { id } = req.params;
    // Delete the restaurant using the findByIdAndDelete method
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RATE a restaurant by ID
exports.rateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { userRating } = req.body;
  const userId = req.session.user.id;

  try {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const existingRating = restaurant.userRatings.find(
      (rating) => rating.userId.toString() === userId
    );

    if (existingRating) {
      // If user has rated before, update their rating
      const previousRating = existingRating.rating;
      existingRating.rating = userRating;

      // Update average rating (no change to ratingCount)
      restaurant.rating =
        (restaurant.rating * restaurant.ratingCount -
          previousRating +
          userRating) /
        restaurant.ratingCount;
    } else {
      // New rating from this user
      restaurant.userRatings.push({ userId, rating: userRating });

      // Update rating and increment ratingCount
      restaurant.rating =
        (restaurant.rating * restaurant.ratingCount + userRating) /
        (restaurant.ratingCount + 1);
      restaurant.ratingCount += 1;
    }

    await restaurant.save();

    res.status(200).json({ message: "Rating submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
