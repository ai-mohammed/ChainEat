import React, { useState } from "react";
import axios from "axios";

const RateRestaurant = ({ restaurantId }) => {
  const [rating, setRating] = useState(1);

  const handleRate = async () => {
    try {
      await axios.post("https://chaineat-nean.onrender.com/restaurants/rate", {
        restaurantId,
        rating,
      });
      alert("Rated successfully!");
    } catch (err) {
      alert("Rating failed");
    }
  };

  return (
    <div>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value={1}>1 Star</option>
        <option value={2}>2 Stars</option>
        <option value={3}>3 Stars</option>
        <option value={4}>4 Stars</option>
        <option value={5}>5 Stars</option>
      </select>
      <button onClick={handleRate}>Submit Rating</button>
    </div>
  );
};

export default RateRestaurant;
