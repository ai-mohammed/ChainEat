import React, { useState } from "react";
import axios from "axios";

// Component for rating a restaurant
const RateRestaurant = ({ restaurantId }) => {
  // State to store the selected rating value
  const [rating, setRating] = useState(1);

  // Function to submit the rating to the backend
  const handleRate = async () => {
    try {
      // Send a POST request to the backend with restaurant ID and rating
      await axios.post("https://chaineat-9acv.onrender.com/restaurants/rate", {
        restaurantId,
        rating,
      });
      alert("Rated successfully!"); // Notify the user of success
    } catch (err) {
      alert("Rating failed"); // Notify the user of failure
    }
  };

  return (
    <div>
      {/* Dropdown for selecting a rating */}
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value={1}>1 Star</option>
        <option value={2}>2 Stars</option>
        <option value={3}>3 Stars</option>
        <option value={4}>4 Stars</option>
        <option value={5}>5 Stars</option>
      </select>

      {/* Button to submit the rating */}
      <button onClick={handleRate}>Submit Rating</button>
    </div>
  );
};

export default RateRestaurant;
