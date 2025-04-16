const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// Validation middleware for creating a restaurant
// Validation middleware for creating a restaurant
const validateRestaurant = [
  check("name").notEmpty().withMessage("Name is required"),
  check("address").notEmpty().withMessage("Address is required"),
  check("cuisine").notEmpty().withMessage("Cuisine is required"),
  // REMOVE rating validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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

// Route for users to rate a restaurant (no admin required)
router.post(
  "/:id/rate",
  isAuthenticated, // Only authenticated users can rate
  [
    check("userRating")
      .isNumeric()
      .withMessage("Rating must be a number")
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  restaurantController.rateRestaurant
);

// Export the router to be used in server.js
module.exports = router;
