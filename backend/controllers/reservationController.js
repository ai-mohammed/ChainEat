const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");

// Create a new reservation (Only Customers)
exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, date, time, guests } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const reservationDatetime = new Date(`${date}T${time}`);

    const newReservation = await Reservation.create({
      user: req.session.user.id,
      restaurant: restaurantId,
      reservationDate: reservationDatetime,
      numberOfGuests: guests,
    });

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reservations for logged-in user (Customers)
exports.getUserReservations = async (req, res) => {
  try {
    if (req.session.user.role !== "customer") {
      return res.status(403).json({ error: "Access denied." });
    }

    const reservations = await Reservation.find({
      user: req.session.user.id,
    }).populate("restaurant");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reservations (Managers/Admins)
exports.getAllReservations = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.session.user.role)) {
      return res.status(403).json({ error: "Access denied." });
    }

    const reservations = await Reservation.find()
      .populate("user")
      .populate("restaurant");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a reservation (Only Admins)
exports.updateReservation = async (req, res) => {
  try {
    if (req.session.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a reservation (Only Admins)
exports.deleteReservation = async (req, res) => {
  try {
    if (req.session.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }

    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
