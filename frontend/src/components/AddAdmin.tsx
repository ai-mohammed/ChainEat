import { useState } from "react";
import axios from "axios";

type AxiosCustomError = {
  response?: {
    data?: {
      msg?: string;
    };
  };
};

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://chaineat-9acv.onrender.com/auth/register-admin",
        { email, password, role: "admin" },
        { withCredentials: true }
      );
      alert("Admin created successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      const error = err as AxiosCustomError;
      alert(error.response?.data?.msg || "Failed to create admin.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Admin</h3>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Create Admin</button>
    </form>
  );
};

export default AddAdmin;
