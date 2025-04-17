// Import necessary hooks and libraries
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginphoto from "../assets/login.jpg";
import { Link } from "react-router-dom"; // Used for navigation to Register page

// Props expected by the Login component (used to set the user after login)
type Props = {
  setUser: (user: { email: string; role: string }) => void; // User object with email and role
};

// Login component definition
const Login = ({ setUser }: Props) => {
  // Local state to store input fields and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Navigation hook for redirecting after login

  // Handle form submission and send login request to backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to show button feedback

    try {
      // Send POST request to login endpoint with user credentials
      const res = await axios.post(
        "https://chaineat-9acv.onrender.com/auth/login",
        { email, password },
        { withCredentials: true } // Include cookies/session for login
      );

      // Store user data in parent component
      setUser({ email: (res.data as any).email, role: (res.data as any).role });

      // Redirect user to reservations page upon successful login
      navigate("/reservations");
    } catch (err: any) {
      // Handle error and show a user-friendly message
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div
      className="login-container"
      style={{ display: "flex", background: "white", alignItems: "center" }}
    >
      {/* Left side image panel */}
      <div className="login-image" style={{ flex: 1 }}>
        <img
          src={loginphoto}
          alt="Login"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>

      {/* Right side form panel */}
      <div className="login-form" style={{ flex: 1, padding: "5%" }}>
        <form className="auth-form" onSubmit={handleLogin}>
          <h2 style={{ textAlign: "center" }}>Login</h2>

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit button with loading state */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Navigation link to register page */}
          <p className="auth-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Export the component for usage in other parts of the app
export default Login;
