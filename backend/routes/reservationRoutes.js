const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// Validation middleware
const validateReservation = [
  check("restaurantId").notEmpty().withMessage("Restaurant ID is required"),
  check("date").notEmpty().withMessage("Date is required"),
  check("time").notEmpty().withMessage("Time is required"),
  check("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Customer Routes

// Users must be logged in to create a reservation
router.post("/", isAuthenticated, reservationController.createReservation);
router.get("/my", reservationController.getUserReservations);

// Manager/Admin Routes
router.get(
  "/",
  isAuthenticated,
  isAdmin,
  reservationController.getAllReservations
);
// Cancel reservation
router.put(
  "/my/:id/cancel",
  isAuthenticated,
  reservationController.cancelReservation
);

//admins
// Only admins can update reservations
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  reservationController.updateReservation
);

// Only admins can delete reservations
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  reservationController.deleteReservation
);

module.exports = router;
