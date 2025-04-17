// Import React's useState hook for managing form state
import { useState } from "react";
// Import Axios for HTTP requests
import axios from "axios";

// Define the expected structure of an Axios error response
type AxiosCustomError = {
  response?: {
    data?: {
      msg?: string; // Optional message returned from server
    };
  };
};

// Component for adding a new admin user
const AddAdmin = () => {
  // Local state for email and password fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior (page reload)
    try {
      // Send POST request to backend to register a new admin
      await axios.post(
        "https://chaineat-9acv.onrender.com/auth/register-admin",
        { email, password, role: "admin" }, // Payload with role explicitly set to 'admin'
        { withCredentials: true } // Include cookies/session
      );
      alert("Admin created successfully!");
      // Clear input fields after success
      setEmail("");
      setPassword("");
    } catch (err) {
      // Cast error type and display custom or fallback message
      const error = err as AxiosCustomError;
      alert(error.response?.data?.msg || "Failed to create admin.");
    }
  };

  // Render form UI
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Admin</h3>
      {/* Email input field */}
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Password input field */}
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {/* Submit button */}
      <button type="submit">Create Admin</button>
    </form>
  );
};

// Export the component so it can be used elsewhere in the app
export default AddAdmin;
