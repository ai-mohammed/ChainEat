import React, { useState, useEffect } from "react";
import axios from "axios";

// Reservations Component: Handles viewing and making reservations
const Reservations = () => {
  // State variables to manage reservations and input fields
  const [reservations, setReservations] = useState([]);
  const [restaurantId, setRestaurantId] = useState(""); // Stores the selected restaurant ID
  const [date, setDate] = useState(""); // Stores reservation date
  const [time, setTime] = useState(""); // Stores reservation time
  const [guests, setGuests] = useState(1); // Stores number of guests

  // Fetch user's reservations on component mount
  useEffect(() => {
    axios
      .get("https://chaineat-9acv.onrender.com/reservations/my", {
        withCredentials: true,
      })
      .then((response) => setReservations(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Function to handle creating a new reservation
  const makeReservation = async () => {
    try {
      await axios.post(
        "https://chaineat-9acv.onrender.com/reservations",
        {
          restaurantId,
          date: date,
          time: time,
          guests: guests,
        },
        { withCredentials: true } // Ensures authentication with the backend
      );

      alert("Reservation successful!"); // Notify user on success
    } catch (err) {
      alert("Reservation failed: " + err.response?.data?.errors?.[0]?.msg || "Unknown error"); // Show error message if available
    }
  };

  return (
    <div className="reservations-container">
      <h2>My Reservations</h2>
      <ul>
        {/* Display the list of user's reservations */}
        {reservations.map((r) => (
          <li key={r._id}>
            {r.restaurant.name} -{" "}
            {new Date(r.reservationDate).toLocaleDateString()} ({r.status})
          </li>
        ))}
      </ul>

      <h3>Create a New Reservation</h3>
      {/* Input field for restaurant ID */}
      <input
        type="text"
        placeholder="Restaurant ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        required
      />
      {/* Input field for selecting reservation date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      {/* Input field for selecting reservation time */}
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      {/* Input field for selecting number of guests */}
      <input
        type="number"
        placeholder="Number of guests"
        min="1"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        required
      />
      {/* Button to submit the reservation */}
      <button onClick={makeReservation}>Reserve</button>
    </div>
  );
};

export default Reservations;
