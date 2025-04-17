// Import hooks and modules
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginphoto from "../assets/login.jpg";
import { Link } from "react-router-dom"; // For routing to login page

// Register component for user account creation
const Register = () => {
  // State to manage form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Stores validation or submission errors

  const navigate = useNavigate(); // For navigation after registration

  // Handle form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh

    // Check if passwords match before submitting
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send registration data to backend
      await axios.post("https://chaineat-9acv.onrender.com/auth/register", {
        email,
        password,
      });

      // On success: clear fields and redirect to login
      alert("Registered successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      navigate("/login"); // Go to login page
    } catch {
      // Handle registration failure
      setError("Registration failed");
    }
  };

  return (
    <div
      className="register-container"
      style={{ display: "flex", background: "white", alignItems: "center" }}
    >
      {/* Left side image */}
      <div className="login-image" style={{ flex: 1 }}>
        <img
          src={loginphoto}
          alt="Login"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>

      {/* Right side form */}
      <div className="login-form" style={{ flex: 1, padding: "20px" }}>
        <form className="auth-form" onSubmit={handleRegister}>
          <h2 style={{ textAlign: "center" }}>Register</h2>
          <p style={{ textAlign: "center" }}>
            Create an account to start making reservations.
          </p>

          {/* Email field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirm password field */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Error message display */}
          {error && <p className="error-text">{error}</p>}

          {/* Submit button */}
          <button type="submit">Register</button>

          {/* Link to login page */}
          <p className="auth-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Export the component
export default Register;
