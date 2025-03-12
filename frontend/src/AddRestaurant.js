import React, { useState } from "react";
import axios from "axios";

const AddRestaurant = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://chaineat-9acv.onrender.com/restaurants/add", {
        name,
        address,
        cuisine,
      });
      alert("Restaurant added successfully!");
    } catch (err) {
      alert("Failed to add restaurant");
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
