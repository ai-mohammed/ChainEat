const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// Validation middleware for creating a restaurant
const validateRestaurant = [
  // Ensure all required fields are provided and meet the specified criteria (e.g., name is not empty, address is not empty, etc.)
  check("name").notEmpty().withMessage("Name is required"),
  check("address").notEmpty().withMessage("Address is required"),
  check("cuisine").notEmpty().withMessage("Cuisine is required"),
  // Ensure the rating is a number between 0 and 5
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  // Check for validation errors
  (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);
    // If errors exist, return them as a 400 (Bad Request) response to the client. This will trigger the error handling middleware in server.js.
    if (!errors.isEmpty()) {
      // Return a 400 response with the array of errors if validation fails
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route to create a new restaurant by the administrator
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateRestaurant,
  restaurantController.createRestaurant
);

// Route to get all restaurants
router.get("/", restaurantController.getAllRestaurants);

// Route to get a single restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Route to update a restaurant by ID
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  restaurantController.updateRestaurant
);

// Route to delete a restaurant by ID
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  restaurantController.deleteRestaurant
);

// Export the router to be used in server.js
module.exports = router;
