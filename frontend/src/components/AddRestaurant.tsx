// Import React's useState hook to manage form state
import { useState } from "react";
// Import Axios for making HTTP requests
import axios from "axios";

// Define the structure of a possible Axios error response
type AxiosCustomError = {
  response?: {
    data?: {
      error?: string; // Optional error message returned by the backend
    };
  };
};

// Component for adding a new restaurant (accessible to admins only)
const AddRestaurant = () => {
  // State variables for the restaurant's name, address, and cuisine
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from reloading on form submit
    try {
      // Send POST request to backend with form data
      await axios.post(
        "https://chaineat-9acv.onrender.com/restaurants", // Endpoint for adding a new restaurant
        {
          name,
          address,
          cuisine,
        },
        { withCredentials: true } // Include session cookies
      );
      alert("Restaurant added successfully!");

      // Reset form inputs
      setName("");
      setAddress("");
      setCuisine("");
    } catch (err) {
      // Cast error and display either backend message or default
      const error = err as AxiosCustomError;
      console.error(error);
      alert(error.response?.data?.error || "Failed to add restaurant");
    }
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      {/* Restaurant name input */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {/* Address input */}
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      {/* Cuisine input */}
      <input
        type="text"
        placeholder="Cuisine"
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        required
      />
      {/* Submit button */}
      <button type="submit">Add Restaurant</button>
    </form>
  );
};

// Export the component to be used in other parts of the app
export default AddRestaurant;
