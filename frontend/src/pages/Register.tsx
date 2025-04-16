import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginphoto from "../assets/login.jpg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State to store error messages
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("https://chaineat-9acv.onrender.com/auth/register", {
        email,
        password,
      });
      alert("Registered successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(""); // Clear error on successful registration
      navigate("/login"); // Redirect to login page after successful registration
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div
      className="register-container"
      style={{ display: "flex", background: "white", alignItems: "center" }}
    >
      <div className="login-image" style={{ flex: 1 }}>
        <img
          src={loginphoto}
          alt="Login"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>
      <div className="login-form" style={{ flex: 1, padding: "20px" }}>
        <form className="auth-form" onSubmit={handleRegister}>
          <h2 style={{ textAlign: "center" }}>Register</h2>
          <p style={{ textAlign: "center" }}>
            Create an account to start making reservations.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}{" "}
          {/* Display error message */}
          <button type="submit">Register</button>
          <p className="auth-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
