const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Validation middleware for creating a restaurant
const validateRestaurant = [
  check("name").notEmpty().withMessage("Name is required"),
  check("address").notEmpty().withMessage("Address is required"),
  check("cuisine").notEmpty().withMessage("Cuisine is required"),
  // Additional validations can be added here
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a 400 response with the array of errors if validation fails
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route to create a new restaurant
router.post("/", validateRestaurant, restaurantController.createRestaurant);

// Route to get all restaurants
router.get("/", restaurantController.getAllRestaurants);

// Route to get a single restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Route to update a restaurant by ID
router.put("/:id", restaurantController.updateRestaurant);

// Route to delete a restaurant by ID
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
