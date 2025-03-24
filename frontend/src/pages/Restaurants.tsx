import { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurant from "../components/AddRestaurant";
import RateRestaurant from "../components/RateRestaurant";

type Restaurant = {
  _id: string;
  name: string;
  address: string;
  cuisine: string;
  description?: string;
};

type User = {
  email: string;
  role: string;
};

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    address: "",
    cuisine: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/restaurants")
      .then((res) => setRestaurants(res.data as Restaurant[]))
      .catch((err) => console.error(err));

    axios
      .get<User>("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant._id);
    setEditData({
      name: restaurant.name,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      description: restaurant.description || "",
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/restaurants/${id}`, editData, {
        withCredentials: true,
      });
      setRestaurants(
        restaurants.map((r) => (r._id === id ? { ...r, ...editData } : r))
      );
      setEditingId(null);
      alert("Updated successfully!");
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/restaurants/${id}`, {
        withCredentials: true,
      });
      setRestaurants(restaurants.filter((r) => r._id !== id));
      alert("Deleted successfully!");
    } catch {
      alert("Deletion failed");
    }
  };

  return (
    <div className="restaurants-container">
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r._id}>
            {editingId === r._id ? (
              <>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editData.cuisine}
                  onChange={(e) =>
                    setEditData({ ...editData, cuisine: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
                <button onClick={() => handleUpdate(r._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <b>{r.name}</b> - {r.cuisine} <br />
                {r.address}
                <br />
                {r.description}
                <br />
                <RateRestaurant restaurantId={r._id} />
                {user?.role === "admin" && (
                  <>
                    <button onClick={() => handleEdit(r)}>Edit</button>
                    <button onClick={() => handleDelete(r._id)}>Delete</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {user?.role === "admin" && <AddRestaurant />}
    </div>
  );
};

export default Restaurants;
