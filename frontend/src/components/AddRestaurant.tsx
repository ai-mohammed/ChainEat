import { useState } from "react";
import axios from "axios";

type AxiosCustomError = {
  response?: {
    data?: {
      error?: string;
    };
  };
};
const AddRestaurant = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://chaineat-9acv.onrender.com/restaurants", // ✅ fixed endpoint
        {
          name,
          address,
          cuisine,
        },
        { withCredentials: true }
      );
      alert("Restaurant added successfully!");
      setName("");
      setAddress("");
      setCuisine("");
    } catch (err) {
      const error = err as AxiosCustomError; // clearly typed
      console.error(error);
      alert(error.response?.data?.error || "Failed to add restaurant");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Cuisine"
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        required
      />
      <button type="submit">Add Restaurant</button>
    </form>
  );
};

export default AddRestaurant;
