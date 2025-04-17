// Import React's useState hook for managing component state
import { useState } from "react";
// Import Axios to handle HTTP requests
import axios from "axios";

// Define the props expected by the component
type Props = {
  restaurantId: string; // The ID of the restaurant to be rated
};

// Component that allows a user to rate a restaurant from 1 to 5 stars
const RateRestaurant = ({ restaurantId }: Props) => {
  // Local state to keep track of the selected rating value
  const [rating, setRating] = useState<number>(1);

  // Function that sends the selected rating to the backend
  const handleRate = async () => {
    try {
      // Send POST request with rating for the restaurant
      await axios.post(
        `https://chaineat-9acv.onrender.com/restaurants/${restaurantId}/rate`,
        {
          userRating: rating, // Send the selected rating
        },
        { withCredentials: true } // Include session cookies
      );
      alert("Rated successfully!");
    } catch {
      // Handle any errors during the request
      alert("Rating failed");
    }
  };

  // Render a dropdown and submit button for rating
  return (
    <div>
      {/* Dropdown to select rating from 1 to 5 */}
      <select
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {`${num} Star${num > 1 ? "s" : ""}`} {/* Adds 's' for plural */}
          </option>
        ))}
      </select>

      {/* Button to submit the selected rating */}
      <button onClick={handleRate}>Submit Rating</button>
    </div>
  );
};

// Export the component so it can be used in other parts of the app
export default RateRestaurant;
