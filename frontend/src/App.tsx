// Import hooks and routing tools
import { useEffect, useState } from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css"; // Global styles

// Import page and component files
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import Reservations from "./components/Reservations";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/ContactUs";
import Footer from "./components/Footer";

// Define user type
type User = {
  email: string;
  role: string; // User role (admin or customer)
};

// Backend API base URL
const API_BASE = "https://chaineat-9acv.onrender.com";

// Main App component
function App() {
  // State to store logged-in user and loading status
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user session when the app loads
  useEffect(() => {
    axios
      .get(`${API_BASE}/auth/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data as User | null); // Set user if logged in
        setLoading(false);
      })
      .catch(() => {
        setUser(null); // Set user to null if not logged in or request fails
        setLoading(false);
      });
  }, []);

  // Logout handler
  const logout = async () => {
    await axios.get(`${API_BASE}/auth/logout`, { withCredentials: true });
    setUser(null);
  };

  // While loading (checking auth), show a loading message
  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left side of navbar with static page links */}
          <div className="nav-left">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/restaurants" className="nav-link">
              Restaurants
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>

          {/* Right side of navbar changes depending on user auth */}
          <div className="nav-right">
            {user ? (
              <>
                <Link to="/reservations" className="nav-link">
                  My Reservations
                </Link>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link register-button">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Define application routes */}
      <Routes>
        {/* Home page with user passed as prop */}
        <Route path="/" element={<Home user={user} />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Static pages */}
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected route: Reservations page only if logged in */}
        <Route
          path="/reservations"
          element={user ? <Reservations /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* Global footer at the bottom of every page */}
      <Footer />
    </>
  );
}

// Export App as default so it's used in main.tsx
export default App;
