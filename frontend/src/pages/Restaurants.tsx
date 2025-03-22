import { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurant from "../components/AddRestaurant";
import RateRestaurant from "../components/RateRestaurant";

type Restaurant = {
  _id: string;
  name: string;
  cuisine: string;
};

type User = {
  email: string;
  role: string;
};

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch all restaurants
    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data as Restaurant[]))
      .catch((err) => console.error(err));

    // Fetch current logged-in user (to determine if admin)
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data as User))
      .catch(() => setUser(null));
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

      {/* 👇 Conditionally render AddRestaurant only for admin */}
      {user?.role === "admin" && <AddRestaurant />}
    </div>
  );
};

export default Restaurants;
