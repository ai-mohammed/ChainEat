import { useState } from "react";
import axios from "axios";

type Props = {
  restaurantId: string;
};

const RateRestaurant = ({ restaurantId }: Props) => {
  const [rating, setRating] = useState<number>(1);

  const handleRate = async () => {
    try {
      await axios.post(
        `http://localhost:5000/restaurants/${restaurantId}/rate`,
        {
          userRating: rating,
        },
        { withCredentials: true }
      );
      alert("Rated successfully!");
    } catch {
      alert("Rating failed");
    }
  };

  return (
    <div>
      <select
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {`${num} Star${num > 1 ? "s" : ""}`}
          </option>
        ))}
      </select>
      <button onClick={handleRate}>Submit Rating</button>
    </div>
  );
};

export default RateRestaurant;
