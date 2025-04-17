const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");

// Create a new reservation (Only Customers)
exports.createReservation = async (req, res) => {
  try {
    const { restaurantName, date, time, guests } = req.body;

    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const reservationDatetime = new Date(year, month - 1, day, hour, minute);

    const restaurant = await Restaurant.findOne({ name: restaurantName });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const reservationDatetime = new Date(`${date}T${time}`);

    // Check for reservation conflicts (pending or confirmed)
    const existingReservation = await Reservation.findOne({
      restaurant: restaurant._id,
      reservationDate: reservationDatetime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingReservation) {
      return res.status(400).json({ error: "Time slot already reserved" });
    }
    // To avoid user's duplicate reservations
    const userReservation = await Reservation.findOne({
      user: req.session.user.id,
      reservationDate: reservationDatetime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (userReservation) {
      return res.status(400).json({
        error: "You already have a reservation at this date and time",
      });
    }

    const newReservation = await Reservation.create({
      user: req.session.user.id,
      restaurant: restaurant._id,
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
    const { status } = req.body;

    // Validate status explicitly
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid reservation status" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
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

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { status: "cancelled" },
      { new: true }
    );

    if (!reservation) {
      return res
        .status(404)
        .json({ error: "Reservation not found or unauthorized" });
    }

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
