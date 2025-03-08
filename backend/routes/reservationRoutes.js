const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

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
router.post("/", validateReservation, reservationController.createReservation);
router.get("/my", reservationController.getUserReservations);

// Manager/Admin Routes
router.get("/", reservationController.getAllReservations);

// Admin Routes
router.put("/:id", reservationController.updateReservation);
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;

