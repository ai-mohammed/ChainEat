import { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurant from "../components/AddRestaurant";
import RateRestaurant from "../components/RateRestaurant";

type Restaurant = {
  _id: string;
  name: string;
  cuisine: string;
};

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="restaurants-container">
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r._id}>
            {r.name} - {r.cuisine}
            <RateRestaurant restaurantId={r._id} />
          </li>
        ))}
      </ul>
      <AddRestaurant />
    </div>
  );
};

export default Restaurants;
